// Cal.com Atoms Token Refresh Utility
// This handles refreshing expired access tokens for Cal Atoms integration

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface CalAtomsConfig {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
}

/**
 * Refresh an expired Cal.com access token
 * This function should be called from your backend API endpoint
 */
export async function refreshCalAtomsToken(
  refreshToken: string,
  config: CalAtomsConfig
): Promise<RefreshTokenResponse> {
  try {
    const response = await fetch(`${config.apiUrl}/oauth-clients/${config.clientId}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cal-secret-key': config.clientSecret,
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(`Cal.com API error: ${data.error || 'Unknown error'}`);
    }

    return {
      access_token: data.data.accessToken,
      refresh_token: data.data.refreshToken,
      expires_in: 3600, // Cal.com tokens expire in 60 minutes
    };
  } catch (error) {
    console.error('Error refreshing Cal.com token:', error);
    throw error;
  }
}

/**
 * Create a new managed user in Cal.com
 */
export async function createManagedUser(
  userEmail: string,
  userName: string,
  config: CalAtomsConfig,
  options?: {
    timeFormat?: 12 | 24;
    weekStart?: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    timeZone?: string;
  }
) {
  try {
    const response = await fetch(`${config.apiUrl}/oauth-clients/${config.clientId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cal-secret-key': config.clientSecret,
      },
      body: JSON.stringify({
        email: userEmail,
        name: userName,
        timeFormat: options?.timeFormat || 24,
        weekStart: options?.weekStart || 'Monday',
        timeZone: options?.timeZone || 'America/New_York',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create managed user: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(`Cal.com API error: ${data.error || 'Unknown error'}`);
    }

    return {
      userId: data.data.user.id,
      email: data.data.user.email,
      username: data.data.user.username,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
  } catch (error) {
    console.error('Error creating managed user:', error);
    throw error;
  }
}

/**
 * Get Cal.com configuration from environment variables
 * This function works both client-side and server-side
 */
export function getCalAtomsConfig(): CalAtomsConfig {
  // Check if we're in a browser environment
  const isClient = typeof window !== 'undefined';
  
  let clientId: string | undefined;
  let clientSecret: string | undefined;
  let apiUrl: string | undefined;
  
  if (isClient) {
    // Client-side: use import.meta.env (Vite) or the defined process.env
    clientId = import.meta.env?.VITE_BOOKER_EMBED_OAUTH_CLIENT_ID || (globalThis as any).process?.env?.CAL_OAUTH_CLIENT_ID;
    // For security, client secret should not be exposed to client
    // This should only be used server-side or in a secure context
    clientSecret = (globalThis as any).process?.env?.CAL_OAUTH_CLIENT_SECRET;
    apiUrl = (globalThis as any).process?.env?.CAL_API_URL || 'https://api.cal.com/v2';
  } else {
    // Server-side: use process.env directly
    clientId = process.env.CAL_OAUTH_CLIENT_ID;
    clientSecret = process.env.CAL_OAUTH_CLIENT_SECRET;
    apiUrl = process.env.CAL_API_URL || 'https://api.cal.com/v2';
  }

  if (!clientId) {
    throw new Error('Missing required Cal.com client ID. Check your environment variables.');
  }
  
  // For client-side usage, we only need clientId and apiUrl
  if (isClient && !clientSecret) {
    console.warn('Cal.com client secret not available in client environment (this is expected for security)');
    return {
      clientId,
      clientSecret: '', // Empty for client-side
      apiUrl: apiUrl || 'https://api.cal.com/v2',
    };
  }

  if (!clientSecret && !isClient) {
    throw new Error('Missing required Cal.com client secret. Check your environment variables.');
  }

  return {
    clientId,
    clientSecret: clientSecret || '',
    apiUrl: apiUrl || 'https://api.cal.com/v2',
  };
}
