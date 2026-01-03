import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get time-based theme (light 6am-7pm, dark 7pm-6am)
const getTimeBasedTheme = (): Theme => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19 ? 'light' : 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if user has a saved preference
    const savedPreference = localStorage.getItem('founder-fm-theme-preference');
    if (savedPreference === 'light' || savedPreference === 'dark') {
      return savedPreference as Theme;
    }
    // Otherwise use time-based theme
    return getTimeBasedTheme();
  });

  // Update theme based on time if no user preference is set
  useEffect(() => {
    const savedPreference = localStorage.getItem('founder-fm-theme-preference');
    if (!savedPreference) {
      const timeBasedTheme = getTimeBasedTheme();
      setTheme(timeBasedTheme);
    }
  }, []);

  // Check time periodically and update if no user preference
  useEffect(() => {
    const interval = setInterval(() => {
      const savedPreference = localStorage.getItem('founder-fm-theme-preference');
      if (!savedPreference) {
        const timeBasedTheme = getTimeBasedTheme();
        setTheme(timeBasedTheme);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save user preference
    localStorage.setItem('founder-fm-theme-preference', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

