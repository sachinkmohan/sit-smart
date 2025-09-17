import { NavLink } from "react-router";
const RatioHistory = () => {
  const lastSevenDaysLog = JSON.parse(
    localStorage.getItem("lastSevenDaysLog") || "[]"
  );

  const formatTime = (counter: number) => {
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter % 3600) / 60);
    const seconds = counter % 60;
    return { hours, minutes, seconds };
  };

  return (
    <div className="flex flex-col bg-white p-5 rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-purple-700 tracking-wide">
          7-Day History
        </h1>
        <NavLink
          to="/"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 transition-colors duration-150 shadow-sm bg-blue-50"
        >
          ← Back to Home
        </NavLink>
      </div>
      <table className="min-w-full mt-4 border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Stand Time (mins)</th>
            <th className="px-4 py-2 border">Sit Time (mins)</th>
            <th className="px-4 py-2 border">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {lastSevenDaysLog.map(
            (entry: { date: string; sitting: number; standing: number }) => {
              const formattedStanding = formatTime(Number(entry.standing));
              const formattedSitting = formatTime(Number(entry.sitting));
              const ratio = (entry.standing / entry.sitting).toFixed(2);
              return (
                <tr key={entry.date}>
                  <td className="px-4 py-2 border">{entry.date}</td>
                  <td className="px-4 py-2 border">
                    <span>
                      <span className="text-blue-600 font-semibold">{`${formattedStanding.hours}h ${formattedStanding.minutes}m ${formattedStanding.seconds}s`}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <span>
                      <span className="text-green-700 font-semibold">{`${formattedSitting.hours}h ${formattedSitting.minutes}m ${formattedSitting.seconds}s`}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{ratio} : 1</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RatioHistory;
