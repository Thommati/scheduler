import { useState } from 'react';

const useVisualMode = (initialMode) => {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(prev => [...prev.slice(0, -1), newMode])
    } else {
      setHistory(prev => [...prev, newMode]);
    }
    setMode(newMode);
  };

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
