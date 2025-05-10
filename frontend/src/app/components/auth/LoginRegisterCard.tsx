"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

import SignInCard from "./SignInCard";
import SignUpCard from "./SignUpCard";
const LoginRegisterCard = () => {

  const [activeTab, setActiveTab] = useState<string>('signin')


  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* Sign In */ }
        <SignInCard />

        {/* Sign Up */}
        <SignUpCard setActiveTab={setActiveTab} />
      </Tabs>
    </div>
  );
};

export default LoginRegisterCard;
