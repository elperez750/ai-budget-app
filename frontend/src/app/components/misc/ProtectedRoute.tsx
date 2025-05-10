"use client"

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'
import { useRouter } from "next/navigation"
import LoadingComponent from './LoadingComponent';
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
            <LoadingComponent />
          );
    }

  return children
}

export default ProtectedRoute
