import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from environment or localStorage
    const envTheme = import.meta.env.VITE_THEME_MODE as Theme;
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || envTheme || "light";
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">(() => {
    // Initialize actual theme based on system preference or saved theme
    const savedTheme = localStorage.getItem("theme") as Theme;
    const envTheme = import.meta.env.VITE_THEME_MODE as Theme;
    const initialTheme = savedTheme || envTheme || "light";

    if (initialTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return initialTheme;
  });

  // Apply theme immediately on component mount (synchronous)
  useLayoutEffect(() => {
    const root = window.document.documentElement;

    let newActualTheme: "light" | "dark";

    if (theme === "system") {
      newActualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      newActualTheme = theme;
    }

    // Apply theme to DOM immediately
    root.classList.remove("light", "dark");
    root.classList.add(newActualTheme);

    setActualTheme(newActualTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let newActualTheme: "light" | "dark";

      if (theme === "system") {
        newActualTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      } else {
        newActualTheme = theme;
      }

      setActualTheme(newActualTheme);

      // Apply theme to DOM
      root.classList.remove("light", "dark");
      root.classList.add(newActualTheme);

      // Update meta theme-color based on theme
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute(
          "content",
          newActualTheme === "dark" ? "#121212" : "#ffffff",
        );
      }
    };

    // Initial theme update
    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Save theme preference
    localStorage.setItem("theme", theme);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
