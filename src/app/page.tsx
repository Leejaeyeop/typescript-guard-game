import { MAX_SIZE } from "../constants/sizes";
import { api } from "../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Quiz } from "@/types/quiz";
import GameView from "@/features/game-view/GameView";

export default async function Home() {
  let quizzes: Quiz[] = [];

  try {
    quizzes = await fetchQuery(api.quizzes.get);
  } catch (error) {
    console.error("Failed to fetch quiz data:", error);
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center flex-col bg-black">
      <div
        className={`flex-grow w-full h-full flex flex-col items-center justify-center`}
        style={{
          maxWidth: MAX_SIZE + "px",
          maxHeight: MAX_SIZE + "px",
        }}
      >
        <GameView totalQuizzes={quizzes} />
      </div>
    </main>
  );
}

export const revalidate = 3600;
