import { useEffect, useRef, useState } from "react";

/* 
Start timer -> starts the sitCounter ✅
Stop Sitting & Stand Now -> starts the standTimer & stops the sitCounter ✅
Show Document title the active timer - ✅
End Session - Resets sitCounter & standCounter, stores to the total Standing & Sitting time✅ 
store to Local Storage -  ✅
*/

export const TimeTracker = () => {
  const [sitCounter, setSitCounter] = useState<number>(0);
  const [standCounter, setStandCounter] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<"sit" | "stand" | null>(null);
  const activeCounter = currentMode === "sit" ? sitCounter : standCounter;

  const sitIntervalRef = useRef<number | null>(null);
  const standIntervalRef = useRef<number | null>(null);

  const formatTime = (counter: number) => {
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter % 3600) / 60);
    const seconds = counter % 60;
    return { hours, minutes, seconds };
  };

  const todayTotalStanding =
    localStorage.getItem("todayTotalStanding") || "Do a Session";
  const formattedTodayTotalStanding = formatTime(
    parseInt(todayTotalStanding, 10)
  );

  const todayTotalSitting =
    localStorage.getItem("todayTotalSitting") || "Do a Session";

  const formattedTodayTotalSitting = formatTime(
    parseInt(todayTotalSitting, 10)
  );

  useEffect(() => {
    if (currentMode === null) return;
    const { hours, minutes, seconds } = formatTime(activeCounter);
    document.title = `${
      currentMode === "sit" ? "Sit ⏲️" : "Stand ⏲️"
    } : ${hours}h :${minutes}m :${seconds}s `;
  }, [activeCounter, currentMode]);

  function startCounter(type: "sit" | "stand") {
    const ref = type === "sit" ? sitIntervalRef : standIntervalRef;
    const setFn = type === "sit" ? setSitCounter : setStandCounter;
    if (ref.current) return;
    ref.current = setInterval(() => {
      setFn((prev) => prev + 1);
    }, 1000);

    setCurrentMode(type);
  }
  function resetSitCounter() {
    if (sitIntervalRef.current != undefined) {
      clearInterval(sitIntervalRef.current);
    }
    const todayTotalSitting = parseInt(
      localStorage.getItem("todayTotalSitting") ?? "0",
      10
    );
    localStorage.setItem(
      "todayTotalSitting",
      (todayTotalSitting + sitCounter).toString()
    );
    setSitCounter(0);
    startCounter("stand");
    setCurrentMode("stand");
    sitIntervalRef.current = null;
  }

  function endSession() {
    if (standIntervalRef.current != undefined) {
      clearInterval(standIntervalRef.current);
    }
    const todayTotalStanding = parseInt(
      localStorage.getItem("todayTotalStanding") ?? "0",
      10
    );
    localStorage.setItem(
      "todayTotalStanding",
      (todayTotalStanding + standCounter).toString()
    );
    setStandCounter(0);
    standIntervalRef.current = null;
  }

  function resetAllDataLocalStorage() {
    localStorage.setItem("todayTotalStanding", "0");
    localStorage.setItem("todayTotalSitting", "0");
  }

  const sitTime = formatTime(sitCounter);
  const standTime = formatTime(standCounter);

  return (
    <>
      <div className="flex flex-col  bg-white p-5 rounded-2xl shadow-2xl">
        <div className="flex gap-2 justify-center">
          <button
            className={`${
              currentMode === "sit"
                ? "disabled:bg-gray-400 disabled:cursor-not-allowed"
                : "!bg-green-500 text-white"
            }`}
            onClick={() => startCounter("sit")}
            disabled={currentMode === "sit"}
          >
            Start timer
          </button>
          <button
            className={`${
              currentMode === "stand"
                ? "disabled:bg-gray-400 disabled:cursor-not-allowed"
                : "!bg-green-500 text-white"
            }`}
            onClick={resetSitCounter}
            disabled={currentMode === "stand"}
          >
            Stand Now
          </button>
          <button
            className="!bg-red-200  disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={endSession}
          >
            End Session
          </button>
        </div>
        <div className="flex gap-4 m-4 justify-center">
          <div className="rounded-lg py-4 px-9 bg-gray-200">
            <p className="text-sm font-bold">Current 🧘 Time</p>
            <p className="text-2xl font-bold">{`${sitTime.hours}h: ${sitTime.minutes}m: ${sitTime.seconds}s`}</p>
          </div>
          <div className="rounded-lg py-4 px-9 bg-gray-200">
            <p className="text-sm font-bold">Current 🧍‍♂️ Time</p>
            <p className="text-2xl font-bold">{`${standTime.hours}h: ${standTime.minutes}m: ${standTime.seconds}s`}</p>
          </div>
        </div>
        <div className="flex flex-col bg-purple-200 py-4 mx-4 rounded-lg">
          <p className="text-sm font-bold">Total 🧘 Today</p>
          <p className="text-2xl font-bold">{` ${formattedTodayTotalSitting.hours}h: ${formattedTodayTotalSitting.minutes}m: ${formattedTodayTotalSitting.seconds}s`}</p>
        </div>
        <div className="flex flex-col m-4 py-4 bg-green-200 rounded-lg">
          <p className="text-sm font-bold">Total🧍 Today</p>
          <p className="text-2xl font-bold">{`${formattedTodayTotalStanding.hours}h: ${formattedTodayTotalStanding.minutes}m: ${formattedTodayTotalStanding.seconds}s`}</p>
        </div>
        <button
          className="!bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 shadow-md w-fit mx-auto"
          onClick={resetAllDataLocalStorage}
        >
          Reset All For Today
        </button>
        <p className="text-gray-500 text-sm mt-3">
          This will reset all your sitting and standing time for today.
        </p>
      </div>
    </>
  );
};
