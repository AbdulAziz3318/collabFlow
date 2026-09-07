import { ClipLoader } from "react-spinners";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <ClipLoader color="#5B5FEF" size={40} />
    </div>
  );
};

export default Loader;