export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "summarize-html") {
        const body = document.body.innerHTML;
        browser.runtime.sendMessage(
          { type: "summarize-html", body },
          (response) => {
            sendResponse({ summary: response.summary });
          }
        );
      }
      return true;
    });
  },
});
