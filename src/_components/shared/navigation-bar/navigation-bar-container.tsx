import React from "react";

export default function NavigationBarContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center space-x-6">{children}</div>;
}
