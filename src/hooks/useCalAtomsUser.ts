import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createManagedUser, getCalAtomsConfig } from '@/lib/cal-atoms-refresh';

interface CalAtomsUser {
  cal_user_id: number;
  email: string;
  username: string;
  eventTypeSlug?: string;
  access_token: string;
  refresh_token: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseCalAtomsUserReturn {
  calUser: CalAtomsUser | null;
  isLoading: boolean;
  error: string | null;
  createCalUser: () => Promise<{
    access_token: string;
    cal_user_id: number;
    created_at: string;
    email: string;
    id: number;
    orbit_user_id: string;
    refresh_token: string;
    updated_at: string;
    username: string;
  }>;
  refreshToken: () => Promise<void>;
  isCreatingUser: boolean;
}

/**
 * Hook to manage Cal.com managed users for the current OrbitCRM user
 * This integrates Cal Atoms with your existing authentication system
 */
export function useCalAtomsUser(): UseCalAtomsUserReturn {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get current user from Supabase
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Query for existing Cal.com managed user
  const { data: calUser, isLoading } = useQuery({
    queryKey: ['cal-atoms-user', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      
      const { data, error } = await supabase
        .from('cal_atoms_users')
        .select('*')
        .eq('orbit_user_id', currentUser.id)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return data;
    },
    enabled: !!currentUser?.id,
  });

  // Mutation to create a new managed user
  const createCalUserMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.email) {
        throw new Error('User email not available. Please make sure you are logged in.');
      }

      // Extract user name from various possible sources
      const fullName = currentUser.user_metadata?.full_name || 
                      currentUser.user_metadata?.name ||
                      currentUser.user_metadata?.display_name ||
                      `${currentUser.user_metadata?.first_name || ''} ${currentUser.user_metadata?.last_name || ''}`.trim() ||
                      currentUser.email.split('@')[0]; // Fallback to email username
      
      console.log('Current user data:', {
        email: currentUser.email,
        metadata: currentUser.user_metadata,
        extractedName: fullName
      });

      if (!fullName) {
        throw new Error('User name could not be determined. Please update your profile.');
      }

      // Call our backend to create real Cal.com managed user
      console.log('Creating real Cal.com managed user for:', {
        email: currentUser.email,
        name: fullName
      });
      
      const response = await supabase.functions.invoke('cal-atoms-user', {
        body: {
          email: currentUser.email,
          name: fullName
        }
      });
      
      if (response.error) {
        console.error('Cal.com user creation error:', response.error);
        throw new Error(`Failed to create Cal.com user: ${response.error.message}`);
      }
      
      if (!response.data?.success) {
        console.error('Cal.com API error:', response.data?.error);
        throw new Error(`Cal.com API error: ${response.data?.error || 'Unknown error'}`);
      }
      
      const managedUserData = response.data.data;
      console.log('Cal.com managed user created successfully:', {
        cal_user_id: managedUserData.cal_user_id,
        email: managedUserData.email,
        username: managedUserData.username
      });

      // The managed user is already stored in the database by the backend function
      // Just return the data we got back
      return managedUserData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cal-atoms-user', currentUser?.id] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  // Mutation to refresh access token
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      if (!calUser?.refresh_token) {
        throw new Error('No refresh token available');
      }

      // This should be called from your backend refresh endpoint
      const response = await fetch('/api/cal-atoms/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${calUser.access_token}`,
        },
        body: JSON.stringify({
          refreshToken: calUser.refresh_token,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const { accessToken, refreshToken } = await response.json();

      // Update tokens in database
      const { data, error } = await supabase
        .from('cal_atoms_users')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          updated_at: new Date().toISOString(),
        })
        .eq('id', calUser.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cal-atoms-user', currentUser?.id] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return {
    calUser,
    isLoading,
    error,
    createCalUser: createCalUserMutation.mutateAsync,
    refreshToken: async () => {
      await refreshTokenMutation.mutateAsync();
      return;
    },
    isCreatingUser: createCalUserMutation.isPending,
  };
}
