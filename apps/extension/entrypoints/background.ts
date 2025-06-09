export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      if (message.type === "summarize-html") {
        const summary = await fetchSummaryFromAPI(message.html);

        console.log(summary, "summary");

        sendResponse({ summary });
      }
      return true;
    }
  );
});

const fetchSummaryFromAPI = async (html: string) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

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
          content: "You are a helpful assistant that summarizes HTML.",
        },
        { role: "user", content: html },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};
