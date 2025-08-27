import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // Query the global_users table to check if the email exists
      const { data, error } = await supabase
        .from('global_users')
        .select('user_id')
        .eq('user_id', 'temp'); // This won't find anything, we need a different approach

      if (error) {
        console.error("Error checking email:", error);
        return false;
      }

      // Alternative approach: Try to sign in with a fake password to check if user exists
      // This will return different errors for existing vs non-existing users
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'fake-password-to-check-user-existence'
      });

      console.log("Sign in error for email check:", signInError);

      // If the error is "Invalid login credentials", the user exists but password is wrong
      // If the error is "Invalid login credentials" or similar, we need to check the specific message
      if (signInError) {
        // Supabase returns "Invalid login credentials" for both wrong password and non-existing user
        // for security reasons. We'll use a different approach.
        
        // Let's try the password reset directly and handle the response
        return true; // We'll let Supabase handle it and check the response
      }

      return false;
    } catch (error) {
      console.error("Error in email check:", error);
      return false;
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/password-reset-submit`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Password reset error:", error);
        
        // Handle specific error cases
        if (error.message.includes("User not found") || 
            error.message.includes("Invalid email") ||
            error.message.includes("user_not_found") ||
            error.message.toLowerCase().includes("not found")) {
          toast({
            title: "Email not found",
            description: "No account exists with this email address. Please check your email or sign up for a new account.",
            variant: "destructive",
          });
        } else if (error.message.includes("rate limit") || error.message.includes("too many")) {
          toast({
            title: "Too many requests",
            description: "Please wait a moment before requesting another password reset.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "An error occurred while sending the reset email. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      console.log("Password reset email sent successfully");
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email and follow the instructions to reset your password.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetPage;
