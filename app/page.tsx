"use client";

import { Loading } from "@/components/loading";
import Onboard from "@/components/onboard";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { age, setAge, hasHydrated } = useUserStore();

  useEffect(() => {
    if (hasHydrated && age && age > 0) {
      router.push("/explore");
    }
  }, [age, hasHydrated, router]);

  const handleSubmit = ({ age }: { age: number }) => {
    setAge(age);
    router.push("/explore");
  };

  if (!hasHydrated) return <Loading fullScreen />;
  if (age && age > 0) return null;
  return (
    <div className="min-h-screen">
      <Onboard onSubmit={handleSubmit} />
    </div>
  );
}
