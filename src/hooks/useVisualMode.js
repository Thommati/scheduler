import { useState } from 'react';

// Hook for managing current mode as well as traveling back through mode history.
const useVisualMode = (initialMode) => {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      // Replace the mode at the end of the history stack
      setHistory(prev => [...prev.slice(0, -1), newMode])
    } else {
      // Push a mode onto the end of history
      setHistory(prev => [...prev, newMode]);
    }
    setMode(newMode);
  };

  // Move back through history stack
  const back = () => {
    if (history.length === 1) {
      return;
    }

    setMode(history.slice(-2)[0]);

    setHistory(prev => {
      return [...prev.slice(0, - 1)];
    });
  };

  return { mode, transition, back };
};

export default useVisualMode;
