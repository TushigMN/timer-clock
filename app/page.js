"use client";

import { useEffect, useState, useRef } from "react";
import ToDoList from "./components/ToDoList"; 

export default function Home() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return (
      String(minutes).padStart(2, "0") + ":" +
      String(seconds).padStart(2, "0") + ":" +
      String(centiseconds).padStart(2, "0")
    );
  };

  const handleStart = () => {
    if (!isRunning) {
      const startTime = Date.now() - time;
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    handleStop();
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prevLaps) => [...prevLaps, time]);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold">Stopwatch</h1>
      <div className="text-6xl font-mono tabular-nums bg-slate-900 px-8 py-4 rounded-xl shadow-md border border-slate-800">
        {formatTime(time)}
      </div>

      <div className="flex gap-4">
        {!isRunning ? (
          <button className="px-8 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition" onClick={handleStart}>
            {time > 0 ? "Resume" : "Start"}
          </button>
        ) : (
          <button className="px-8 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition" onClick={handleStop}>
            Stop
          </button>
        )}

        <button 
          className="px-8 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50" 
          onClick={handleLap}
          disabled={!isRunning}
        >
          Lap
        </button>

        <button className="px-8 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition" onClick={handleReset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-md bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="bg-slate-800 px-4 py-2 font-bold border-b border-slate-700 text-gray-300">Laps</div>
          <ul className="max-h-60 overflow-y-auto">
            {laps.slice().reverse().map((lapTime, index) => (
              <li key={index} className="flex justify-between px-4 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                <span className="text-gray-400 font-medium">Lap {laps.length - index}</span>
                <span className="font-mono text-blue-400">{formatTime(lapTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToDoList />
    </div>
  );
}