import wxtLogo from "/wxt.svg";
import "./App.css";
import { Button } from "@workspace/ui/components/button";

function App() {
  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
      </div>
      <h1>WXT</h1>
      <div className="card">
        <Button>Click me</Button>
      </div>
    </>
  );
}

export default App;
