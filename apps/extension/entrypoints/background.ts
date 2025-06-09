export default defineBackground(() => {
  console.log("Background script loaded!", { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "summarize-html" && message.html) {
      // async 함수를 즉시 실행하고 결과를 처리
      (async () => {
        try {
          const summary = await fetchSummaryFromAPI(message.html);
          console.log(summary, "summary");
          sendResponse({ summary });
        } catch (error) {
          console.error("Error generating summary:", error);
          sendResponse({ summary: "요약 생성 중 오류가 발생했습니다." });
        }
      })();

      return true; // 비동기 응답을 위해 true 반환 ( chrome 에게 비동기 응답을 알림 )
    }
  });
});

const fetchSummaryFromAPI = async (html: string) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  const truncatedContent = html.substring(0, 3000); // 3000자로 제한

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "다음 웹페이지 내용을 한국어로 간단하고 명확하게 요약해주세요. 핵심 내용만 3-5문장으로 요약하세요.",
        },
        { role: "user", content: truncatedContent },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
