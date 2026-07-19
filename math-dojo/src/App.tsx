import { useState } from "react";
import { belts } from "./data/belts";
import { loadProgress, recordSessionResult } from "./engine/progress";
import { MapScreen } from "./screens/MapScreen";
import { LessonScreen } from "./screens/LessonScreen";
import { DrillScreen } from "./screens/DrillScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { StatsScreen } from "./screens/StatsScreen";
import type { ProgressState, SessionSummary, Stripe } from "./types";

type View =
  | { name: "map" }
  | { name: "lesson"; stripe: Stripe }
  | { name: "drill"; stripe: Stripe }
  | { name: "results"; summary: SessionSummary }
  | { name: "stats" };

function findStripe(id: string): Stripe | undefined {
  return belts.flatMap((b) => b.stripes).find((s) => s.id === id);
}

export default function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [view, setView] = useState<View>({ name: "map" });

  function goToMap() {
    setView({ name: "map" });
  }

  function selectStripe(stripeId: string) {
    const stripe = findStripe(stripeId);
    if (stripe) setView({ name: "lesson", stripe });
  }

  function startDrill(stripe: Stripe) {
    setView({ name: "drill", stripe });
  }

  function completeDrill(summary: SessionSummary) {
    const next = recordSessionResult(progress, summary);
    setProgress(next);
    setView({ name: "results", summary });
  }

  function openStats() {
    setView({ name: "stats" });
  }

  switch (view.name) {
    case "lesson":
      return <LessonScreen stripe={view.stripe} onBack={goToMap} onStart={() => startDrill(view.stripe)} />;
    case "drill":
      return <DrillScreen stripe={view.stripe} onComplete={completeDrill} onExit={goToMap} />;
    case "results":
      return (
        <ResultsScreen
          summary={view.summary}
          belts={belts}
          progress={progress}
          onRetry={() => startDrill(view.summary.stripe)}
          onContinue={goToMap}
        />
      );
    case "stats":
      return <StatsScreen belts={belts} progress={progress} onBack={goToMap} />;
    case "map":
    default:
      return <MapScreen belts={belts} progress={progress} onSelectStripe={selectStripe} onOpenStats={openStats} />;
  }
}
