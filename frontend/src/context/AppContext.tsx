import React from 'react';

export const AppContext = React.createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {}
});

const AppProvider = AppContext.Provider;
const AppConsumer = AppContext.Consumer;

export { AppProvider, AppConsumer };
