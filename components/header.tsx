"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.replace("/");
    window.dispatchEvent(new CustomEvent("resetExplore"));
  };
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-lg z-40">
      <div className="flex justify-center items-center h-14 px-4">
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <path
                fill="currentColor"
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">educasm</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
