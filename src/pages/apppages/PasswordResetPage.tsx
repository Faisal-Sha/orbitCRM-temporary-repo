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

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, check if the email exists in the global_users table
      console.log("Checking if email exists in global_users:", email);
      
      // Query the global_users table to check if user exists with this email
      // Note: We need to check against auth.users for the actual email, 
      // but we'll use a different approach since we can't directly query auth.users
      
      // Try to get user data from Supabase auth first to see if user exists
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log("Error checking auth users:", authError);
        // If we can't check auth users directly, try the password reset and handle the error
        const redirectUrl = `${window.location.origin}/password-reset-submit`;
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (resetError) {
          console.error("Password reset error:", resetError);
          if (resetError.message.includes("User not found") || resetError.message.includes("Invalid email")) {
            toast({
              title: "Email not found",
              description: "No account exists with this email address. Please check your email or sign up for a new account.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: resetError.message || "An error occurred while sending the reset email. Please try again.",
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }

        console.log("Password reset email sent successfully");
        setIsSubmitted(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for the password reset link.",
        });
        setIsLoading(false);
        return;
      }

      // Check if the email exists in the auth users
      const userExists = authUsers.users.some(user => user.email === email);
      
      if (!userExists) {
        console.log("Email not found in auth users");
        toast({
          title: "Email not found",
          description: "No account exists with this email address. Please check your email or sign up for a new account.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Email found in auth users, proceeding with password reset");
      
      // If email exists, proceed with password reset
      const redirectUrl = `${window.location.origin}/password-reset-submit`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while sending the reset email. Please try again.",
          variant: "destructive",
        });
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
              {isLoading ? "Checking Email..." : "Send Reset Link"}
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
