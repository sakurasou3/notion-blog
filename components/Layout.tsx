import React from "react";
import { Navbar } from "./Navbar/Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};
