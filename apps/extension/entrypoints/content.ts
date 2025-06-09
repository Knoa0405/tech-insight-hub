export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "summarize-html") {
        const html = document.documentElement.outerHTML;
        browser.runtime.sendMessage(
          { type: "summarize-html", html },
          (response) => {
            sendResponse({ summary: response.summary });
          }
        );
      }
      return true;
    });
  },
});
