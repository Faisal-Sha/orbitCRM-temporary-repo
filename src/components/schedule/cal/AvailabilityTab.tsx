import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, Calendar, Clock, User, Plus, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { CalProvider, AvailabilitySettings, CreateEventType, Booker } from "@calcom/atoms";
import { useCalAtomsUser } from "@/hooks/useCalAtomsUser";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  // Cal Atoms doesn't need configuration props - it's fully customizable
}

const AvailabilityTab = ({ }: Props) => {
  const [activeView, setActiveView] = useState<'availability' | 'events' | 'booking'>('availability');
  const { calUser, isLoading, error, createCalUser, isCreatingUser, refreshToken, isRefreshingToken } = useCalAtomsUser();
  
  // Debug: Get current user info
  const { data: currentUser } = useQuery({
    queryKey: ['debug-current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // If no Cal user exists, show setup interface
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your Cal.com integration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cal.com Integration Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!calUser) {
    const handleCreateCalUser = async () => {
      try {
        await createCalUser();
      } catch (err) {
        console.error('Failed to create Cal user:', err);
        // The error will be shown via the error state
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Welcome to Cal.com Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              To use Cal Atoms, you need to create a Cal.com managed user account. This will allow you to manage your availability and bookings directly within OrbitCRM.
            </AlertDescription>
          </Alert>
          
          {/* Authentication Debug Info */}
          <div className="bg-blue-50 p-3 rounded-lg border">
            <h5 className="font-semibold text-sm mb-2">Authentication Status:</h5>
            <div className="text-xs space-y-1">
              <div>
                <strong>Logged in:</strong> {currentUser ? '✅ Yes' : '❌ No'}
              </div>
              {currentUser && (
                <>
                  <div><strong>Email:</strong> {currentUser.email}</div>
                  <div><strong>User ID:</strong> {currentUser.id}</div>
                  <div><strong>User Metadata:</strong></div>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-20">
                    {JSON.stringify(currentUser.user_metadata, null, 2)}
                  </pre>
                </>
              )}
            </div>
            {!currentUser && (
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                  Go to Login
                </Button>
              </div>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Setup Error:</strong> {error}
                <br />
                <small className="mt-2 block text-muted-foreground">
                  If you're not logged in, please log in first. If the issue persists, contact support.
                </small>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">What you'll get:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Custom availability management</li>
              <li>Event type creation and editing</li>
              <li>Booking management within OrbitCRM</li>
              <li>Complete white-label experience</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleCreateCalUser} 
            disabled={isCreatingUser}
            className="w-full"
          >
            {isCreatingUser ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating your Cal.com account...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Cal.com Integration
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check if we have valid access tokens (not demo tokens)
  const hasValidToken = calUser.access_token && calUser.access_token !== 'demo_access_token';

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      toast({
        title: "Token refreshed",
        description: "Cal.com access token has been refreshed successfully.",
      });
    } catch (err: any) {
      console.error('Failed to refresh Cal.com token:', err);
      toast({
        title: "Refresh failed",
        description: err?.message || "Unable to refresh Cal.com access token.",
        variant: "destructive",
      });
    }
  };
  
  // Main Cal Atoms interface with fallback
  if (!hasValidToken) {
    // Show demo/fallback interface when we don't have real Cal.com API access
    return (
      <div className="space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Cal.com Integration (Demo Mode)
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {calUser.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshToken}
                  disabled={isRefreshingToken}
                >
                  {isRefreshingToken ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Token
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                This is running in demo mode with mock credentials. To access the full Cal Atoms interface, you need to set up real Cal.com API credentials.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Demo Navigation Tabs */}
        <Card>
          <CardHeader>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="availability">
                  <Clock className="h-4 w-4 mr-2" />
                  Availability
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Event Types
                </TabsTrigger>
                <TabsTrigger value="booking">
                  <Settings className="h-4 w-4 mr-2" />
                  Booking Page
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeView} className="w-full">
              {/* Demo Availability Management */}
              <TabsContent value="availability" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Demo: Availability Management</h3>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Set Your Working Hours</h4>
                        <p className="text-muted-foreground mt-2">
                          With real Cal.com API credentials, you would see the interactive availability settings here, allowing you to:
                        </p>
                        <ul className="text-sm mt-3 space-y-1 text-left max-w-md mx-auto">
                          <li>• Set working hours for each day</li>
                          <li>• Configure time slots and durations</li>
                          <li>• Add buffer times between meetings</li>
                          <li>• Set timezone preferences</li>
                          <li>• Define date overrides and holidays</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> This is a demo interface. To see the actual Cal Atoms availability component, 
                          you need to configure real Cal.com API credentials in your environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Demo Event Types */}
              <TabsContent value="events" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Demo: Event Types</h3>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Calendar className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Create Meeting Types</h4>
                        <p className="text-muted-foreground mt-2">
                          The real Cal Atoms interface would allow you to create and manage different types of meetings:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto">
                          <div className="border rounded-lg p-3 bg-gray-50">
                            <h5 className="font-semibold">15-min Quick Call</h5>
                            <p className="text-sm text-muted-foreground">Brief consultations</p>
                          </div>
                          <div className="border rounded-lg p-3 bg-gray-50">
                            <h5 className="font-semibold">1-hour Strategy Session</h5>
                            <p className="text-sm text-muted-foreground">Detailed planning meetings</p>
                          </div>
                          <div className="border rounded-lg p-3 bg-gray-50">
                            <h5 className="font-semibold">30-min Team Check-in</h5>
                            <p className="text-sm text-muted-foreground">Regular team updates</p>
                          </div>
                          <div className="border rounded-lg p-3 bg-gray-50">
                            <h5 className="font-semibold">Custom Duration</h5>
                            <p className="text-sm text-muted-foreground">Flexible meeting types</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Demo Booking Interface */}
              <TabsContent value="booking" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Demo: Booking Page</h3>
                  </div>
                  
                  <Alert>
                    <AlertDescription>
                      This shows how the Cal Atoms booking interface would appear to your clients.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-background border rounded-lg p-6">
                    <div className="max-w-md mx-auto">
                      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold">Interactive Booking Widget</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          With real credentials, clients would see:
                        </p>
                        <ul className="text-sm mt-3 space-y-1 text-left">
                          <li>• Calendar with available slots</li>
                          <li>• Meeting type selection</li>
                          <li>• Contact form</li>
                          <li>• Confirmation system</li>
                          <li>• Timezone handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 How to Enable Full Cal Atoms Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold mb-2">To see the real Cal Atoms interface:</h5>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Create a Cal.com Platform OAuth app at <a href="https://app.cal.com/settings/developer" className="text-blue-600 underline" target="_blank">app.cal.com/settings/developer</a></li>
                <li>Replace the demo credentials in your environment with real ones</li>
                <li>Implement the backend endpoints for user creation and token refresh</li>
                <li>The Cal Atoms components will then render with full functionality</li>
              </ol>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold mb-2">✅ What's Working:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Authentication system with OrbitCRM</li>
                <li>Cal Atoms components are properly imported</li>
                <li>Environment configuration is set up</li>
                <li>Database schema is ready for Cal.com data</li>
                <li>Webhook handling is implemented</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Real Cal Atoms interface (when we have valid tokens)
  return (
    <CalProvider
      accessToken={calUser.access_token}
      options={{
        apiUrl: import.meta.env.VITE_CAL_API_URL || "https://api.cal.com/v2",
        refreshUrl: "/api/cal-atoms/refresh"
      }}
      clientId={import.meta.env.VITE_BOOKER_EMBED_OAUTH_CLIENT_ID || "cmg516pf70011qg1rugq0oenv"}
    >
      <div className="space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Cal.com Integration Active
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {calUser.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshToken}
                  disabled={isRefreshingToken}
                >
                  {isRefreshingToken ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Token
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation Tabs */}
        <Card>
          <CardHeader>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="availability">
                  <Clock className="h-4 w-4 mr-2" />
                  Availability
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Event Types
                </TabsTrigger>
                <TabsTrigger value="booking">
                  <Settings className="h-4 w-4 mr-2" />
                  Booking Page
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeView} className="w-full">
              {/* Availability Management */}
              <TabsContent value="availability" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Manage Your Availability</h3>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <div className="min-h-[400px]">
                      <AvailabilitySettings 
                        onUpdateSuccess={(availability) => {
                          console.log('Availability updated:', availability);
                        }}
                        onUpdateError={(error) => {
                          console.error('Availability error:', error);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Event Types */}
              <TabsContent value="events" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Event Types</h3>
                  </div>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <CreateEventType
                      onSuccess={(eventType) => {
                        console.log("EventType created successfully", eventType);
                      }}
                      customClassNames={{
                        atomsWrapper: "border p-4 rounded-md",
                        buttons: { submit: "bg-red-500", cancel: "bg-gray-300" },
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Booking Interface */}
              <TabsContent value="booking" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Booking Interface</h3>
                  </div>
                  
                  <Alert>
                    <AlertDescription>
                      This is how clients will see your booking page within OrbitCRM. You can customize the appearance and behavior here.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-background border rounded-lg p-4">
                    <Booker 
                      eventSlug={calUser.eventTypeSlug}
                      username={calUser.username}
                      onCreateBookingSuccess={() => {
                        console.log("booking created successfully");
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </CalProvider>
  );
};

export default AvailabilityTab;
