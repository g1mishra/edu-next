"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { sendGAEvent } from "@next/third-parties/google";

export const GTM_PageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    sendGAEvent("event", "page_view", {
      page_path: fullPath,
    });
  }, [pathname, searchParams]);

  return null;
};
