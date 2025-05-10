import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Link from "next/link";
import { ArrowRight, BarChart, Target, CreditCard } from "lucide-react";

const AuthRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Take Control of Your Finances
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Budget Tracker helps you manage your money, track expenses, and reach
            your financial goals. Join thousands of users who have improved their
            financial health.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg">
                Create free account
                <ArrowRight size={20} />
              </Button>
            </Link>
            
            <Link href="/auth">
              <Button variant="outline" className="px-8 py-6 rounded-lg text-lg border-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                Log in
              </Button>
            </Link>
          </div>
        </div>
        
      

        {/* Features section */}
        <h2 className="text-3xl font-bold text-center mb-10">Powerful Features to Manage Your Money</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">Track Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Easily log and categorize your income and expenses to see where
                your money goes. Import from your bank or add manually.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/auth" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
                Learn more <ArrowRight size={16} />
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Create custom budgets for different categories and get alerts when
                you're close to limits. Stay on top of your spending habits.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/auth" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 flex items-center gap-1">
                Learn more <ArrowRight size={16} />
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-semibold">Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Set savings goals for big purchases, emergencies, or retirement
                and track your progress with visual charts and projections.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/auth" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                Learn more <ArrowRight size={16} />
              </Link>
            </CardFooter>
          </Card>
        </div>
        
       </div>
      
    </div>
  );
};

export default AuthRequired;