"use client";

import Link from "next/link";
import { Menu, User, LogIn } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "../../components/ui/sheet";

export function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="font-semibold text-xl p-6">
            Budgeting App
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="text-sm font-medium hover:text-primary"
            >
              Transactions
            </Link>
            <Link
              href="/budgets"
              className="text-sm font-medium hover:text-primary"
            >
              Budgets
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Chat with AI
            </Link>
            <Link href="/auth">
              <Button className="cursor-pointer" size="sm">
                <LogIn className="w-4 h-4 mr-1" />
                Login / Signup
              </Button>
            </Link>
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User account</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <SheetTitle className="text-lg font-semibold mt-4">
                  Menu
                </SheetTitle>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/transactions" className="text-sm font-medium">
                    Transactions
                  </Link>
                  <Link href="/budgets" className="text-sm font-medium">
                    Budgets
                  </Link>
                  <Link href="/contact" className="text-sm font-medium">
                    Chat with AI
                  </Link>
                  <Link href="/auth" className="text-sm font-medium flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login / Signup
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
