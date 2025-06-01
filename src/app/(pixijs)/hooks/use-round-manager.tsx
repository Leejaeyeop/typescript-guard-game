import { useState } from "react";
import { RoundPhase } from "../types/roundPhase";

export function useRoundManager() {
  const [roundPhase, setRoundPhase] = useState<RoundPhase>("ROUND_START");

  return { roundPhase, setRoundPhase };
}
