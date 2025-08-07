import "./App.css";
import { TimeTracker } from "./components/TimeTracker";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
function App() {
  return (
    <>
      <SiteHeader />
      <TimeTracker />
      <SiteFooter />
    </>
  );
}

export default App;
