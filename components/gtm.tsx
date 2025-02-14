"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { sendGAEvent } from "@next/third-parties/google";

export const GTM_PageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    const search = window.location.search;
    const fullPath = search ? `${pathname}?${search}` : pathname;

    sendGAEvent("event", "page_view", {
      page_path: fullPath,
    });
  }, [pathname]);

  return null;
};
