import { useTheme } from "../lib/theme";

/**
 * Sun / moon toggle. Dark is the default brand look; light is the warm
 * EPR cream/espresso theme. Smooth icon cross-fade.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative grid place-items-center w-10 h-10 rounded-full text-foreground/80 hover:text-primary transition-colors duration-300 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        className="absolute h-[18px] w-[18px] transition-all duration-500"
        style={{
          opacity: isDark ? 1 : 0,
          transform: `rotate(${isDark ? 0 : -90}deg) scale(${isDark ? 1 : 0.6})`,
        }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        className="absolute h-[18px] w-[18px] transition-all duration-500"
        style={{
          opacity: isDark ? 0 : 1,
          transform: `rotate(${isDark ? 90 : 0}deg) scale(${isDark ? 0.6 : 1})`,
        }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
