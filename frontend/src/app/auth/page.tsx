import React from "react";
import LoginRegisterCard from "../components/auth/LoginRegisterCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full mb-6">
        <div className="textleft">
          <Link
            href="/"
            className="inline-flex items-center text-black hover:text-gray"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 mb-4">
            Log in to your account or create a new one to get started.
          </p>
          <p className="text-sm text-gray-500">
            Access all your favorite features and manage your profile with ease.
            We're glad to see you again!
          </p>
        </div>
      </div>
      <LoginRegisterCard />
    </div>
  );
};

export default page;
