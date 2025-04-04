"use client";

import React, { useState } from "react";
import { TabsContent } from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useAuth } from "../context/AuthContext";

const SignInCard = () => {
  //Setting state for our form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Error we will display to the user, such as incorrect password
  const [signinError, setSigninError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError("");

    if (!username || !password) {
      setSigninError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      console.log("calling login function. Pressing the button!")
      const result = await login(username, password);
      console.log("Login function returned:", result);

      if (result.success) {
        router.push("/");
      } else {
        // Handle case where login returned success: false
        setSigninError(result.error || "Login failed. Please try again.");
      }
    } catch (error: any) {
      setSigninError("Login failed. Please try again.");

      // Improved error handling
      if (error.response?.data) {
        // Handle specific API error messages
        if (typeof error.response.data === "string") {
          setSigninError(error.response.data);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="signin">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            {signinError && (
              <div className="text-red-500 text-sm">{signinError}</div>
            )}
            <div className="space-y-1">
              <Label htmlFor="signin_username">Username</Label>
              <Input
                id="signin_username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signin_password">Password</Label>
              <Input
                id="signin_password"
                type="password"
                value={password}
                placeholder="••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-4">
            <Button type="submit" className="w-full cursor-pointer">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
};

export default SignInCard;
