import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useColorScheme, Appearance } from "react-native";

/**
 * ThemeContext.tsx
 * This file contains the ThemeContext and ThemeProvider components.
 */
export type ThemeColors = {
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  separatorColor: string;
  outlineButtonBorderColor: string;
  inputBackgroundColor: string;
};

/**
 * ThemeProvider component
 * This component provides the theme context to its children.
 */
export const lightTheme: ThemeColors = {
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  secondaryTextColor: "#666666",
  buttonBackgroundColor: "#2196F3",
  buttonTextColor: "#FFFFFF",
  separatorColor: "#E0E0E0",
  outlineButtonBorderColor: "#2196F3",
  inputBackgroundColor: "#F8F8F8",
};

/**
 * Dark theme colors
 * This theme is used when the device is in dark mode.
 */
export const darkTheme: ThemeColors = {
  backgroundColor: "#121212",
  textColor: "#FFFFFF",
  secondaryTextColor: "#AAAAAA",
  buttonBackgroundColor: "#0D47A1",
  buttonTextColor: "#FFFFFF",
  separatorColor: "#333333",
  outlineButtonBorderColor: "#90CAF9",
  inputBackgroundColor: "#333333",
};

/**
 * ThemeContextType
 * This type defines the structure of the theme context.
 */
type ThemeContextType = {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
};

/**
 * ThemeContext
 * This context provides the theme and dark mode state to the application.
 */
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 *
 * @param param0 - The children
 * @param param0.children - The children of the provider
 * @returns
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark");
    });
    return () => subscription.remove();
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  /**
   * toggleTheme
   * This function toggles the theme between light and dark mode.
   */
  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  const setDarkMode = (dark: boolean) => {
    setIsDark(dark);
  };

  /**
   * contextValue
   * This value is provided to the ThemeContext.
   */
  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
