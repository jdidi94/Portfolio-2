import type { JSX } from "react";
import { Suspense, lazy } from "react";
import { AppLoadingScreen } from "@components/ui/AppLoadingScreen";

const AppExperience = lazy(async () => {
  const module = await import("@app/AppExperience");
  return { default: module.AppExperience };
});

export function App(): JSX.Element {
  return (
    <main className="relative h-dvh w-dvw max-w-[100dvw] overflow-hidden bg-[#050508] touch-none select-none">
      <Suspense fallback={<AppLoadingScreen bootOnly />}>
        <AppExperience />
      </Suspense>
    </main>
  );
}
