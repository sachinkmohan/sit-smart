interface StandSitRatioProps {
  StandRatio: number;
  SitRatio: number;
}
const StandSitRatio = ({ StandRatio, SitRatio }: StandSitRatioProps) => {
  const calculatedRatio = (StandRatio / SitRatio).toFixed(2);
  return (
    <div>
      <p className="text-gray-500">Current Stand Sit Ratio</p>
      <p className="text-4xl font-bold">{calculatedRatio} : 1</p>
    </div>
  );
};

export default StandSitRatio;
