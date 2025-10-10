import { useState } from "react";
import { TbTarget } from "react-icons/tb";
import { FaPencilAlt, FaSave } from "react-icons/fa"; // Import pencil and save icons

interface WeeklyStandingGoalProps {
  currentWeekStanding: number; // Current week's total standing time in seconds
}

const WeeklyStandingGoal = ({
  currentWeekStanding,
}: WeeklyStandingGoalProps) => {
  // Get goal from localStorage or default to 10 hours
  const [weeklyGoalHours, setWeeklyGoalHours] = useState<number>(() => {
    const saved = localStorage.getItem("weeklyStandingGoalHours");
    return saved ? parseInt(saved, 10) : 10;
  });

  // Add edit mode state - controls whether user can edit the goal
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Temporary goal value while editing
  const [tempGoalHours, setTempGoalHours] = useState<number>(weeklyGoalHours);

  // Save goal to localStorage only when save button is clicked
  const saveGoal = () => {
    localStorage.setItem("weeklyStandingGoalHours", tempGoalHours.toString());
    setWeeklyGoalHours(tempGoalHours);
    setIsEditMode(false); // Exit edit mode after saving
  };

  // Handle edit button click - enter edit mode
  const handleEditClick = () => {
    setTempGoalHours(weeklyGoalHours); // Set temp value to current goal
    setIsEditMode(true);
  };

  // Handle cancel - exit edit mode without saving
  const handleCancel = () => {
    setTempGoalHours(weeklyGoalHours); // Reset temp value
    setIsEditMode(false);
  };

  // Convert current standing time from seconds to hours
  const currentStandingHours = currentWeekStanding / 3600;

  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(
    (currentStandingHours / weeklyGoalHours) * 100,
    100
  );

  // Handle manual input - validate range
  const handleManualInput = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 168) {
      setTempGoalHours(numValue);
    } else if (value === "") {
      setTempGoalHours(1);
    }
  };

  // Determine progress bar color based on percentage
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "bg-green-500";
    if (progressPercentage >= 75) return "bg-blue-500";
    if (progressPercentage >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    // Remove w-full, let it inherit from parent grid, add max-w-full to prevent overflow
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-indigo-100 max-w-full">
      {/* Header with Edit/Save Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TbTarget className="text-2xl text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-800">Weekly Goal</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Show goal value or editable input based on edit mode */}
          {!isEditMode ? (
            <>
              {/* Display mode - show goal value */}
              <span className="font-bold text-xl text-indigo-600">
                {weeklyGoalHours}
              </span>
              <span className="text-sm font-medium text-gray-600">hrs</span>
              {/* Edit button with pencil icon */}
              <button
                onClick={handleEditClick}
                className="p-2 bg-white hover:bg-indigo-100 rounded-lg shadow-sm transition-all duration-200 border border-gray-200 ml-2"
                aria-label="Edit goal"
              >
                <FaPencilAlt className="text-indigo-600 text-sm" />
              </button>
            </>
          ) : (
            <>
              {/* Edit mode - show native number input with arrows */}
              <input
                type="number"
                value={tempGoalHours}
                onChange={(e) => handleManualInput(e.target.value)}
                min="1"
                max="168"
                className="w-20 text-center font-bold text-xl text-indigo-600 bg-white rounded-lg border-2 border-indigo-400 focus:border-indigo-500 focus:outline-none px-2 py-1 shadow-sm"
              />
              <span className="text-sm font-medium text-gray-600">hrs</span>
              {/* Save button */}
              <button
                onClick={saveGoal}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-all duration-200 text-white ml-2"
                aria-label="Save goal"
              >
                <FaSave className="text-sm" />
              </button>
              {/* Cancel button */}
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-400 hover:bg-gray-500 rounded-lg shadow-sm transition-all duration-200 text-white"
                aria-label="Cancel"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 15 && (
              <span className="text-xs font-bold text-white drop-shadow-md">
                {progressPercentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium">Current Progress</p>
          <p className="text-lg font-bold text-gray-800">
            {currentStandingHours.toFixed(1)}h
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">Remaining</p>
          <p className="text-lg font-bold text-gray-800">
            {Math.max(weeklyGoalHours - currentStandingHours, 0).toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Achievement Badge */}
      {progressPercentage >= 100 && (
        <div className="mt-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-center py-2 px-4 rounded-lg shadow-md animate-pulse">
          <p className="text-sm font-bold">🎉 Goal Achieved!</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyStandingGoal;
