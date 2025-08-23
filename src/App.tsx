import "./App.css";
import { TimeTracker } from "./components/TimeTracker";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <SiteHeader />
      <TimeTracker />
      <SiteFooter />
      <ToastContainer />
    </>
  );
}

export default App;
