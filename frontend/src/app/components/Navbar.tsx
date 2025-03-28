"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User, LogIn, BarChart3, PieChart, MessageSquare, CreditCard, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "../../components/ui/sheet";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import IsAuthNavbar from "./IsAuthNavbar";
import NotAuthNavbar from "./NotAuthNavbar";

const showAuthNavbar = false;

export function Navbar() {

  return (
    <>

      {showAuthNavbar ? ( 
        <IsAuthNavbar />
      
        
     ) : (<NotAuthNavbar />)}
  
  
    </>
  )

}