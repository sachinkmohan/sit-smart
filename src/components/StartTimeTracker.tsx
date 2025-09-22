interface StartTimeTrackerProps {
  readonly sitTime?: string;
  readonly standTime?: string;
}

export default function StartTimeTracker({
  sitTime,
  standTime,
}: StartTimeTrackerProps) {
  if (!sitTime && !standTime) return null;
  return (
    <div className="flex justify-evenly mb-3 text-gray-400 text-sm">
      <div>Sit started at {sitTime || "Not started"}</div>
      <div>Stand started at {standTime || "Not started"}</div>
    </div>
  );
}
