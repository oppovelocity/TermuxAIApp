import { useState, useRef, useEffect } from 'react';
import { executeTermuxCommand, stopTermuxProcess } from '../services/termuxApi';

export const useTermuxShell = () => {
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const currentPid = useRef(null); // Simulate PID for stopping processes

  const runCommand = async (command) => {
    setIsLoading(true);
    setError(null);
    setOutput([]); // Clear previous output
    try {
      // Simulate command execution
      const result = await executeTermuxCommand(command);
      if (result.success) {
        setOutput(result.output);
        setIsRunning(true);
        currentPid.current = Math.floor(Math.random() * 10000) + 1; // Assign a fake PID
      } else {
        setError(result.error || 'Unknown error during command execution.');
        setIsRunning(false);
      }
    } catch (e) {
      setError(e.error || 'Failed to execute command.');
      setIsRunning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCommand = async () => {
    if (isRunning && currentPid.current) {
      setIsLoading(true);
      try {
        const result = await stopTermuxProcess(currentPid.current);
        if (result.success) {
          setOutput(prev => [...prev, result.message]);
          setIsRunning(false);
          currentPid.current = null;
        } else {
          setError(result.error || 'Failed to stop process.');
        }
      } catch (e) {
        setError('Error stopping process.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    output,
    isLoading,
    isRunning,
    error,
    runCommand,
    stopCommand,
  };
};
