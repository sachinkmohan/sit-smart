import { FaCouch } from "react-icons/fa";
const SiteHeader = () => {
  return (
    <div className="mb-4 text-3xl flex flex-col justify-center items-center ">
      <div className="flex gap-2">
        <FaCouch className="mt-1" />
        <h3 className="font-bold">Sit Smart</h3>
      </div>
      <p className="mb-2 text-sm text-gray-600">
        You personal sitting and standing tracker.
      </p>
    </div>
  );
};

export default SiteHeader;
