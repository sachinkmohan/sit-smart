import "./App.css";
import { TimeTracker } from "./components/TimeTracker";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <SiteHeader />
      {/* Add max-width container to constrain app width */}
      <div className="max-w-xl mx-auto px-4">
        <TimeTracker />
      </div>
      <SiteFooter />
      <ToastContainer />
    </>
  );
}

export default App;
