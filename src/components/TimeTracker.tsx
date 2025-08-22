import { useEffect, useRef, useState } from "react";
import { TbWalk, TbClockEdit } from "react-icons/tb";
import { MdSave, MdAirlineSeatReclineNormal } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import { FaSave } from "react-icons/fa";

export const TimeTracker = () => {
  const [sitCounter, setSitCounter] = useState<number>(0);
  const [standCounter, setStandCounter] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<"sit" | "stand" | null>(null);
  const [showLastSession, setShowLastSession] = useState<boolean>(false);
  const [lastSittingTimeToDisplay, setLastSittingTimeToDisplay] =
    useState<string>("");
  const [lastStandingTimeToDisplay, setLastStandingTimeToDisplay] =
    useState<string>("");
  const [initialEditedSittingTime, setInitialEditedSittingTime] =
    useState<string>(lastSittingTimeToDisplay);
  const [initialEditedStandingTime, setInitialEditedStandingTime] =
    useState<string>(lastStandingTimeToDisplay);
  const [finalEditedSittingTime, setFinalEditedSittingTime] =
    useState<string>("");
  const [finalEditedStandingTime, setFinalEditedStandingTime] =
    useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [sittingEnabled, setSittingEnabled] = useState<boolean>(false);
  const [standingEnabled, setStandingEnabled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
    ref.current = setInterval(() => {
      setFn((prev) => prev + 1);
    }, 1000);

    if (type === "sit") {
      if (standIntervalRef.current !== null) {
        clearInterval(standIntervalRef.current);
      }
      console.log("logged sitting");
      setSittingEnabled(true);
      setStandingEnabled(false);
    }
    // Fix: Remove unnecessary else block and directly check sitIntervalRef
    if (type !== "sit") {
      if (sitIntervalRef.current !== null) {
        clearInterval(sitIntervalRef.current);
      }
      setStandingEnabled(true);
      setSittingEnabled(false);
    }
    setCurrentMode(type);
  }

  function pauseSession() {
    if (standIntervalRef.current !== null) {
      clearInterval(standIntervalRef.current);
    }

    if (sitIntervalRef.current !== null) {
      clearInterval(sitIntervalRef.current);
    }
    setSittingEnabled(false);
    setStandingEnabled(false);
  }

  function saveAndResetData() {
    const todayTotalStanding = parseInt(
      localStorage.getItem("todayTotalStanding") ?? "0",
      10
    );
    const todayTotalSitting = parseInt(
      localStorage.getItem("todayTotalSitting") ?? "0"
    );
    localStorage.setItem(
      "todayTotalStanding",
      (todayTotalStanding + standCounter).toString()
    );
    localStorage.setItem(
      "todayTotalSitting",
      (todayTotalSitting + sitCounter).toString()
    );
    setStandCounter(0);
    setSitCounter(0);
    setSittingEnabled(false);
    setStandingEnabled(false);
    standIntervalRef.current = null;
    sitIntervalRef.current = null;
  }

  function saveSession() {
    const { hours, minutes, seconds } = formatTime(sitCounter);
    const {
      hours: hoursStand,
      minutes: minutesStand,
      seconds: secondsStand,
    } = formatTime(standCounter);
    setLastSittingTimeToDisplay(`${hours}h:${minutes}m:${seconds}s`);
    setLastStandingTimeToDisplay(
      `${hoursStand}h:${minutesStand}m:${secondsStand}s`
    );

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(formattedTime);

    setShowLastSession(true);

    saveAndResetData();
  }

  function resetAllDataLocalStorage() {
    if (window.confirm("Are you sure?")) {
      localStorage.setItem("todayTotalStanding", "0");
      localStorage.setItem("todayTotalSitting", "0");
      setShowLastSession(false);
    }
  }

  function parseTimeStringToSeconds(timeString: string): number {
    if (!timeString) return 0;
    const hHMMSSArr = timeString.match(/\d+/g);
    const [timeH, timeM, timeS] = hHMMSSArr ? hHMMSSArr.map(Number) : [0, 0, 0];

    const totalTimeInSeconds = timeH * 60 * 60 + timeM * 60 + timeS;
    return totalTimeInSeconds;
  }

  function saveEditedSessionDurations() {
    const initialEditedSittingTimeInSeconds = parseTimeStringToSeconds(
      initialEditedSittingTime
    );
    const totalFinalEditedSittingInSeconds = parseTimeStringToSeconds(
      finalEditedSittingTime
    );
    const sittingDifferenceInSeconds =
      totalFinalEditedSittingInSeconds - initialEditedSittingTimeInSeconds;

    const initialEditedStandingTimeInSeconds = parseTimeStringToSeconds(
      initialEditedStandingTime
    );
    const totalFinalEditedStandingTimeInSeconds = parseTimeStringToSeconds(
      finalEditedStandingTime
    );
    const standingDifferenceInSeconds =
      totalFinalEditedStandingTimeInSeconds -
      initialEditedStandingTimeInSeconds;
    const todayTotalSitting = parseInt(
      localStorage.getItem("todayTotalSitting") ?? "0",
      10
    );
    localStorage.setItem(
      "todayTotalSitting",
      (todayTotalSitting + sittingDifferenceInSeconds).toString()
    );
    const totalTimeStanding = parseInt(
      localStorage.getItem("todayTotalStanding") ?? "0",
      10
    );
    localStorage.setItem(
      "todayTotalStanding",
      (totalTimeStanding + standingDifferenceInSeconds).toString()
    );
    setInitialEditedSittingTime(finalEditedSittingTime);
    setInitialEditedStandingTime(finalEditedStandingTime);
    setIsModalOpen(false);
  }

  useEffect(() => {
    setInitialEditedSittingTime(lastSittingTimeToDisplay);
    setFinalEditedSittingTime(lastSittingTimeToDisplay);
  }, [lastSittingTimeToDisplay]);

  useEffect(() => {
    setInitialEditedStandingTime(lastStandingTimeToDisplay);
    setFinalEditedStandingTime(lastStandingTimeToDisplay);
  }, [lastStandingTimeToDisplay]);

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
            className={`flex items-center justify-center gap-2  w-full disabled:cursor-not-allowed ${
              activeCounter === sitCounter
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            disabled={sittingEnabled}
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
            className={`flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
              activeCounter === standCounter
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => startCounter("stand")}
            disabled={standingEnabled}
          >
            <TbWalk /> Track Standing
          </button>
        </div>
      </div>
      {showLastSession && (
        <div className="bg-gray-50 border border-gray-200  rounded-lg mx-4 mb-4 py-4 relative">
          <div className="flex justify-around">
            <div className="flex justify-center items-center gap-2">
              <MdAirlineSeatReclineNormal className="text-xl" />
              <div>
                <p className="text-sm text-gray-500 ">Last Sitting Time</p>
                <p className="font-bold text-gray-800">
                  {finalEditedSittingTime}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              <TbWalk className="text-xl" />
              <div>
                <p className="text-sm text-gray-500">Last Stand Time</p>
                <p className="font-bold text-gray-800">
                  {finalEditedStandingTime}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 pl-8 mt-2 flex justify-items-start">
            Saved at {currentTime}
          </p>
          <TbClockEdit
            className="absolute top-0 right-0 translate-x-2 -translate-y-3 text-2xl"
            onClick={() => setIsModalOpen(true)}
          />
          {isModalOpen && (
            <div className="left-1/2 top-1/2 -translate-1/2 w-full h-auto py-6 shadow-lg bg-white border border-gray-300 absolute rounded-lg">
              <div className="px-6">
                <div className="flex justify-between items-center text-xl mb-4">
                  <p className="font-bold">Edit Times</p>
                  <button
                    className="!p-0 text-red-400 !text-2xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
                <div className="flex flex-col text-left mb-2">
                  <label htmlFor="lastSit" className="text-sm mb-1">
                    Last Sitting Time
                  </label>
                  <div className="relative mb-2">
                    <MdAirlineSeatReclineNormal className="absolute top-1/2 left-2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="lastSit"
                      value={finalEditedSittingTime}
                      onChange={(e) =>
                        setFinalEditedSittingTime(e.target.value)
                      }
                      className="border rounded-lg border-gray-300 p-2 pl-8 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <label htmlFor="lastStand" className=" text-sm mb-1">
                    Last Standing Time
                  </label>
                  <div className="relative mb-2">
                    <TbWalk className="absolute top-1/2 -translate-y-1/2 left-2" />
                    <input
                      className="border rounded-lg border-gray-300 p-2 pl-8 w-full"
                      type="text"
                      id="lastStand"
                      value={finalEditedStandingTime}
                      onChange={(e) =>
                        setFinalEditedStandingTime(e.target.value)
                      }
                    />
                  </div>
                </div>
                <button
                  className="bg-blue-400 hover:bg-blue-500 flex items-center justify-center gap-2 w-full p-2 my-2"
                  onClick={() => saveEditedSessionDurations()}
                >
                  <FaSave className="text-white " />{" "}
                  <span className="text-white">Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
          onClick={pauseSession}
          onDoubleClick={saveSession}
        >
          <MdSave /> Pause/Save
        </button>
        <p className="mt-2 text-xs text-gray-400">
          Double Click to Save Session
        </p>
        <button
          className="flex items-center justify-center gap-2 bg-red-400 mt-2 shadow-md w-48 mx-auto text-white"
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
