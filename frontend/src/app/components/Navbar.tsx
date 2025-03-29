"use client";

import IsAuthNavbar from "./IsAuthNavbar";
import NotAuthNavbar from "./NotAuthNavbar";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="text-center p-4"></div>;

  return (
    <>
      {user ? (
        <IsAuthNavbar username={user.username} email={user.email} />
      ) : (
        <NotAuthNavbar />
      )}
    </>
  );
}
