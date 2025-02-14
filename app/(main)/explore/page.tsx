"use client";

import { ExploreView } from "@/components/Explore/ExploreView";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

export default function ExplorePage() {
  const { age } = useUserStore();

  const handleError = (error: string) => {
    if (error.includes("Rate limit exceeded")) {
      toast.error("You've reached the rate limit. Please try again later.", {
        description: error,
        duration: 5000,
      });
    } else {
      toast.error(error);
    }
  };

  return (
    <ExploreView
      onError={handleError}
      userContext={{
        age: age!,
      }}
    />
  );
}
