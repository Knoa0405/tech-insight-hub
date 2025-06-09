import "./App.css";
import { Button } from "@workspace/ui/components/button";
import AiTechLogo from "@/public/ai-tech.svg";
import { useState } from "react";

function App() {
  const [summary, setSummary] = useState("Loading...");

  const handleSummarize = async () => {
    // 현재 탭 찾기
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    const response = await browser.tabs.sendMessage(tab.id!, {
      type: "summarize-html",
    });

    setSummary(response?.summary);
  };

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={AiTechLogo} className="logo" alt="WXT logo" />
        </a>
        <p>{summary}</p>
      </div>
      <h1>Tech Insight Extension</h1>
      <div className="card">
        <Button onClick={handleSummarize}>Summarize</Button>
      </div>
    </>
  );
}

export default App;
