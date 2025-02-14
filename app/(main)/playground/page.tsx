"use client";

import { PlaygroundView } from "@/components/playground/PlaygroundView";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

export default function PlaygroundPage() {
  const { age } = useUserStore();

  const handleError = (message: string) => {
    toast.error(message);
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
