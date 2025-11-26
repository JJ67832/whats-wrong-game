// Einfacher Timer der mit AppState pausiert/fortsetzt
import { AppState } from 'react-native';

let timerCallbacks: { [key: number]: () => void } = {};
let timerIds: { [key: number]: NodeJS.Timeout } = {};
let nextId = 0;

export const setupBackgroundTimer = (callback: () => void, interval: number = 1000): number => {
  const id = nextId++;
  timerCallbacks[id] = callback;
  
  // Verwende normales setInterval, aber pausiere bei AppState change
  timerIds[id] = setInterval(() => {
    if (AppState.currentState === 'active') {
      callback();
    }
  }, interval);
  
  return id;
};

export const clearBackgroundTimer = (timerId: number): void => {
  if (timerIds[timerId]) {
    clearInterval(timerIds[timerId]);
    delete timerIds[timerId];
    delete timerCallbacks[timerId];
  }
};