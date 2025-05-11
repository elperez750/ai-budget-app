"use client";

import React, { useState } from "react";
import { TabsContent } from "../../../components/ui/tabs";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import { API_URL } from "../../../utils/axios";

interface SignUpCardProps {
  setActiveTab: (value: string) => void;
}

const SignUpCard: React.FC<SignUpCardProps> = ({ setActiveTab }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!username || !email || !password) {
      setSignupError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match. Please try again");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/users/signup/`,
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
                withCredentials: true,  // Add this line

        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("User has been successfully created!", {
          description: "You can now log in with your credentials",
          duration: 5000,
        });
        setTimeout(() => setActiveTab("signin"), 100);
      } else {
        setSignupError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      // Improved error handling
      if (error.response?.data) {
        // Handle specific API error messages
        if (typeof error.response.data === "string") {
          setSignupError(error.response.data);
        } else if (typeof error.response.data === "object") {
          // Handle Django validation errors which often come as objects
          const errorMessage = Object.values(error.response.data)[0];
          setSignupError(
            Array.isArray(errorMessage) ? errorMessage[0] : String(errorMessage)
          );
        }
      } else {
        setSignupError(error.message || "An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="signup">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            {signupError && (
              <div className="text-red-500 text-sm">{signupError}</div>
            )}

            <div className="space-y-1">
              <Label htmlFor="signup_name">Username</Label>
              <Input
                id="signup_name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup_email">Email</Label>
              <Input
                id="signup_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup_password">Password</Label>
              <Input
                id="signup_password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup_confirm_password">Confirm Password</Label>
              <Input
                id="signup_confirm_password"
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
};

export default SignUpCard;
