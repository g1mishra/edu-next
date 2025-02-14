"use client";

import { ExploreView } from "@/components/Explore/ExploreView";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

export default function ExplorePage() {
  const { age } = useUserStore();

  const handleError = (message: string) => {
    toast.error(message);
  };

  const handleRelatedQueryClick = (query: string) => {
    console.log("Related query clicked:", query);
  };

  return (
    <ExploreView
      onError={handleError}
      onRelatedQueryClick={handleRelatedQueryClick}
      userContext={{
        age: age!,
      }}
    />
  );
}
