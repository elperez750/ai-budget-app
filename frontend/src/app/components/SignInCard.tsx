"use client";

import React, { useState } from "react";
import { TabsContent } from "../../components/ui/tabs";
import axios from "axios";
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

const SignInCard = () => {
  //Setting state for our form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Error we will display to the user, such as incorrect password
  const [signinError, setSigninError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError("");

    if (!username || !password) {
      setSigninError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/login/",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("email", response.data.user.email);

        router.push("/");
      } else {
        setSigninError("Login failed. Please try again.");
      }
    } catch (error: any) {
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
          <CardFooter>
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
