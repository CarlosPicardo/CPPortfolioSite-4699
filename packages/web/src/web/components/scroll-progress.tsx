import { useScrollProgress } from "../hooks/use-scroll-animation";

export function ScrollProgress() {
  const progress = useScrollProgress();
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}
