"use client";

import BottomNav from "@/components/bottom-nav";
import Header from "@/components/header";
import { Loading } from "@/components/loading";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { age, hasHydrated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && age === undefined) {
      router.push("/");
    }
  }, [age, hasHydrated, router]);

  if (!hasHydrated || !age) {
    return <Loading fullScreen />;
  }

  return (
    <>
      <Header />
      <main className="flex-1 mt-14 mb-[5.5rem]">
        <div className="max-w-4xl mx-auto px-4">{children}</div>
      </main>
      <BottomNav />
    </>
  );
}
