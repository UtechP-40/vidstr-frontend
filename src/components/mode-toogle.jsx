import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useTheme } from "../context/theme.context";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center px-1 transition-all"
    >
      <motion.div
        key={theme}
        animate={{ x: isDark ? 20 : 0 }} // Moves right for dark mode
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-6 h-6 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-md"
      >
        {isDark ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-yellow-500" />}
      </motion.div>
    </Button>
  );
}
