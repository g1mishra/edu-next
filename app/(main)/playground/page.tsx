"use client";

import { PlaygroundView } from "@/components/playground/PlaygroundView";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

export default function PlaygroundPage() {
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

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return (
    <PlaygroundView
      onError={handleError}
      onSuccess={handleSuccess}
      userContext={{
        age: age!,
      }}
    />
  );
}
