import "./App.css";
import { Button } from "@workspace/ui/components/button";

function App() {
  const handleOpenSidePanel = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    await browser.sidePanel.open({
      tabId: tab.id!,
    });
  };

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src="/ai-tech.svg" className="logo" alt="WXT logo" />
        </a>
      </div>
      <h1>Tech Insight Extension</h1>
      <div className="card">
        <Button onClick={handleOpenSidePanel}>Open Side Panel</Button>
      </div>
    </>
  );
}

export default App;
