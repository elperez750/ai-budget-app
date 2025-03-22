// app/components/NavbarWrapper.tsx
'use client';

import { usePathname } from "next/navigation";
import { Navbar } from "./components/Navbar";

export const NavbarWrapper = () => {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/auth");

  if (hideNavbar) return null;

  return <Navbar />;
};
