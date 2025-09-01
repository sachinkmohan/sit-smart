import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";

interface StandSitRatioProps {
  StandRatio: number;
  SitRatio: number;
}
const StandSitRatio = ({ StandRatio, SitRatio }: StandSitRatioProps) => {
  const calculatedRatio = (StandRatio / SitRatio).toFixed(2);
  const unhealthyRange = Number(calculatedRatio) < 1;
  const unhealthyRangeClass = () => {
    return Number(calculatedRatio) < 1 ? "text-red-500" : "text-green-500";
  };
  return (
    <div>
      <p className="text-gray-500">Current Stand Sit Ratio</p>
      <div
        className={`flex justify-center items-center gap-2 ${unhealthyRangeClass()} text-3xl`}
      >
        <p className="font-bold text-4xl">{calculatedRatio} : 1</p>
        {unhealthyRange ? <FaArrowCircleDown /> : <FaArrowCircleUp />}
      </div>
      <p className={`${unhealthyRangeClass()} font-bold`}>
        {unhealthyRange ? "UnHealthy Range ☹️" : "Healthy Range 🙂"}
      </p>
    </div>
  );
};

export default StandSitRatio;
