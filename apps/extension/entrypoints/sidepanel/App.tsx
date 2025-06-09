import "./App.css";
import { Button } from "@workspace/ui/components/button";
import AiTechLogo from "@/public/ai-tech.svg";
import { useState, useEffect } from "react";

function App() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  // 현재 활성 탭 정보 가져오기
  useEffect(() => {
    const getCurrentTab = async () => {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      setCurrentUrl(tab.url || "");
    };
    getCurrentTab();

    // 탭 변경 감지
    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete" && tab.active) {
        setCurrentUrl(tab.url || "");
        setSummary(""); // 새 탭으로 변경시 요약 초기화
      }
    };

    browser.tabs.onUpdated.addListener(handleTabUpdate);
    browser.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await browser.tabs.get(activeInfo.tabId);
      setCurrentUrl(tab.url || "");
      setSummary(""); // 탭 변경시 요약 초기화
    });

    return () => {
      browser.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      // 현재 탭 찾기
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      const response = await browser.tabs.sendMessage(tab.id!, {
        type: "summarize-html",
      });

      setSummary(response?.summary || "요약을 생성할 수 없습니다.");
    } catch (error) {
      console.error("Error:", error);
      setSummary("요약 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="sidepanel-container">
      <header className="sidepanel-header">
        <img src={AiTechLogo} className="logo" alt="Tech Insight Logo" />
        <h1>Tech Insight</h1>
      </header>

      <div className="current-page">
        <h3>현재 페이지</h3>
        <p className="url">{formatUrl(currentUrl)}</p>
      </div>

      <div className="action-section">
        <Button
          onClick={handleSummarize}
          disabled={isLoading || !currentUrl}
          className="summarize-btn"
        >
          {isLoading ? "요약 생성 중..." : "페이지 요약하기"}
        </Button>
      </div>

      <div className="summary-section">
        <h3>요약 결과</h3>
        <div className="summary-content">
          {summary ? (
            <p>{summary}</p>
          ) : (
            <p className="placeholder">
              위 버튼을 클릭하여 현재 페이지를 요약해보세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
