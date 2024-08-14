import { useTheme } from "@/components/theme/theme-provider";
import { Sun, Moon } from "lucide-react"; // Assuming these are your icon components

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark" || theme === "system") {
      setTheme("light");
    }
  };

  return (
    <div className="m-2">
      <button
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-transparent outline-none hover:bg-gray-50 focus:outline-none focus:ring-0 active:outline-none active:ring-0 dark:hover:bg-white/[0.1]"
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
        ) : theme === "dark" ? (
          <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:-rotate-90 dark:scale-0" />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
}
