"use client";

import IsAuthNavbar from "../auth/IsAuthNavbar";
import NotAuthNavbar from "../auth/NotAuthNavbar";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="text-center p-4"></div>;

  return (
    <>
      {user ? (
        <IsAuthNavbar username={user.username} />
      ) : (
        <NotAuthNavbar />
      )}
    </>
  );
}
