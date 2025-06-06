import React from 'react'
import Link from "next/link";
import { Menu, User, LogIn, BarChart3, PieChart, MessageSquare, CreditCard, Home } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "../../../components/ui/sheet";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { UserType } from '../../../utils/UserApi';
import { useAuth } from '../../context/AuthContext';
const IsAuthNavbar = ({username}: Omit<UserType, "id" | "email">) => {


  const {logout} = useAuth()
  return (
    <div>
      <header>
        <div className="container flex h-16 items-center ">
          <div className="flex w-full justify-between items-center">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 ml-2">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                BudgetTracker
              </span>
            </Link>
  
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
               
            
              <Link 
                href="/" 
                className="text-sm font-medium flex items-center gap-1.5 transition hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className="text-sm font-medium flex items-center gap-1.5 transition hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Transactions
              </Link>
              <Link
                href="/budgets"
                className="text-sm font-medium flex items-center gap-1.5 transition hover:text-primary"
              >
                <PieChart className="h-4 w-4" />
                Budgets
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium flex items-center gap-1.5 transition hover:text-primary"
              >
                <MessageSquare className="h-4 w-4" />
                AI Assistant
              </Link>
            </nav>
  
            {/* Right Side Items */}
            <div className="flex items-center gap-3 mr-2 ">
             
              
              <div className="h-6 w-px bg-border hidden md:block"></div>
              
              <Avatar className="h-8 w-8 border hidden md:flex">
                <AvatarFallback className="bg-muted text-xs">
                  {username}
                
                </AvatarFallback>
              </Avatar>

              <Button onClick={logout}>
                Log out
              </Button>
  
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden rounded-full h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[300px] pr-0">
                  <div className="px-4">
                    <SheetTitle className="text-lg font-bold flex items-center mt-4 mb-6">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      BudgetTracker
                    </SheetTitle>
                  </div>
                  <nav className="flex flex-col">
                    <SheetClose asChild>
                      <Link 
                        href="/" 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted"
                      >
                        <Home className="h-5 w-5 text-muted-foreground" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/transactions" 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted"
                      >
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        Transactions
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/budgets" 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted"
                      >
                        <PieChart className="h-5 w-5 text-muted-foreground" />
                        Budgets
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/contact" 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted"
                      >
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        AI Assistant
                      </Link>
                    </SheetClose>
                    
                    <div className="h-px bg-border my-2"></div>
                   
                  </nav>
                  
                  <div className="absolute bottom-6 left-0 right-0 px-4">
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-background text-xs">GB</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium leading-none">Guest</p>
                          <p className="text-xs text-muted-foreground">Sign in to track your budget</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
    </div>
  )
}

export default IsAuthNavbar
