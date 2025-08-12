import { useEffect, useRef, useState } from "react";
import { TbWalk } from "react-icons/tb";
import { MdSave } from "react-icons/md";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";

/* 
Start timer -> starts the sitCounter ✅
Stop Sitting & Stand Now -> starts the standTimer & stops the sitCounter ✅
Show Document title the active timer - ✅
End Session - Resets sitCounter & standCounter, stores to the total Standing & Sitting time✅ 
store to Local Storage -  ✅

sittingDisabled = false, standingDisabled = true, endSessionDisabled = true
sittingDisabled = true, standingDisabled = false, endSessionDisabled = true
sittingDisabled = true, standingDisabled = true, endSessionDisabled = false
*/

export const TimeTracker = () => {
  const [sitCounter, setSitCounter] = useState<number>(0);
  const [standCounter, setStandCounter] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<"sit" | "stand" | null>(null);
  const [sittingDisabled, setSittingDisabled] = useState<boolean>(false);
  const [standingDisabled, setStandingDisabled] = useState<boolean>(true);
  const [endSessionDisabled, setEndSessionDisabled] = useState<boolean>(true);
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
    //if (ref.current) return;
    ref.current = setInterval(() => {
      setFn((prev) => prev + 1);
    }, 1000);

    if (type === "sit") {
      setSittingDisabled(true);
      setStandingDisabled(false);
      if (standIntervalRef.current !== null)
        clearInterval(standIntervalRef.current);
    } else {
      setStandingDisabled(true);
      setEndSessionDisabled(false);
      if (sitIntervalRef.current !== null)
        clearInterval(sitIntervalRef.current);
    }
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
    if (standIntervalRef.current !== null) {
      clearInterval(standIntervalRef.current);
    }

    if (sitIntervalRef.current !== null) {
      clearInterval(sitIntervalRef.current);
    }
    // const todayTotalStanding = parseInt(
    //   localStorage.getItem("todayTotalStanding") ?? "0",
    //   10
    // );
    // const todayTotalSitting = parseInt(
    //   localStorage.getItem("todayTotalSitting") ?? "0"
    // );
    // localStorage.setItem(
    //   "todayTotalStanding",
    //   (todayTotalStanding + standCounter).toString()
    // );
    // localStorage.setItem(
    //   "todayTotalSitting",
    //   (todayTotalSitting + sitCounter).toString()
    // );
    // setStandCounter(0);
    // setSitCounter(0);
    // standIntervalRef.current = null;
    // sitIntervalRef.current = null;
  }

  function resetAllDataLocalStorage() {
    localStorage.setItem("todayTotalStanding", "0");
    localStorage.setItem("todayTotalSitting", "0");
  }

  const sitTime = formatTime(sitCounter);
  const standTime = formatTime(standCounter);

  return (
    <div className="flex flex-col  bg-white p-5 rounded-2xl shadow-2xl">
      <div className="flex gap-4 m-4 justify-center">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg py-4 px-9 bg-gray-200">
            <p className="text-sm font-bold">Current 🧘 Time</p>
            <p className="text-2xl font-bold">{`${sitTime.hours}h: ${sitTime.minutes}m: ${sitTime.seconds}s`}</p>
          </div>
          <button
            className={`flex items-center justify-center gap-2  w-full ${
              activeCounter === sitCounter
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => startCounter("sit")}
          >
            <MdAirlineSeatReclineNormal /> Track Sitting
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg py-4 px-9 bg-gray-200">
            <p className="text-sm font-bold">Current 🧍‍♂️ Time</p>
            <p className="text-2xl font-bold">{`${standTime.hours}h: ${standTime.minutes}m: ${standTime.seconds}s`}</p>
          </div>
          <button
            className={`flex items-center justify-center gap-2 ${
              activeCounter === standCounter
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => startCounter("stand")}
          >
            <TbWalk /> Track Standing
          </button>
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-200  rounded-lg mx-4 mb-4 py-4">
        <div className="flex justify-around">
          <div className="flex justify-center items-center gap-2">
            <MdAirlineSeatReclineNormal className="text-xl" />
            <div>
              <p className="text-sm text-gray-500 ">Last Sitting Time</p>
              <p className="font-bold text-gray-800">0h:7m:0s</p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <TbWalk className="text-xl" />
            <div>
              <p className="text-sm text-gray-500">Last Stand Time</p>
              <p className="font-bold text-gray-800">0h:5m:0s</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pl-8 mt-2 flex justify-items-start">
          Saved at 10:43 am
        </p>
      </div>
      <div className="flex flex-col bg-purple-200 py-4 mx-4 rounded-lg">
        <p className="text-sm font-bold">Total 🧘 Today</p>
        <p className="text-2xl font-bold">{` ${formattedTodayTotalSitting.hours}h: ${formattedTodayTotalSitting.minutes}m: ${formattedTodayTotalSitting.seconds}s`}</p>
      </div>
      <div className="flex flex-col m-4 py-4 bg-green-200 rounded-lg">
        <p className="text-sm font-bold">Total🧍 Today</p>
        <p className="text-2xl font-bold">{`${formattedTodayTotalStanding.hours}h: ${formattedTodayTotalStanding.minutes}m: ${formattedTodayTotalStanding.seconds}s`}</p>
      </div>
      <div className="flex flex-col">
        <button
          className="flex items-center justify-center gap-2 bg-yellow-500 w-48 mx-auto text-white"
          onClick={endSession}
        >
          <MdSave /> Pause/Save
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-red-400 mt-4 shadow-md w-48 mx-auto text-white"
          onClick={resetAllDataLocalStorage}
        >
          <GrPowerReset /> Reset for Today
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-3">
        This will reset all your sitting and standing time for today.
      </p>
    </div>
  );
};
