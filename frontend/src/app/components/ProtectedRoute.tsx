"use client"

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'
import { useRouter } from "next/navigation"
const ProtectedRoute = ({children}: {children: ReactNode}) => {

    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isLoading  && !isAuthenticated) {
            router.push('/auth'); // Redirect to the login page if not authenticated
            
            
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          );
    }

  return children
}

export default ProtectedRoute
