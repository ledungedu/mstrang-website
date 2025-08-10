/* gemini-ui.js
   Giao diện chat + gửi request đến /api/gemini (proxy trên server bạn deploy).
*/

(function () {
  // --- Helper UI ---
  function createChatWidget() {
    const wrapper = document.createElement("div");
    wrapper.id = "ai-chat-widget";
    wrapper.style = `
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 340px;
      max-width: calc(100% - 40px);
      z-index: 9999;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    `;

    wrapper.innerHTML = `
      <div id="chat-header" style="background:#fff;border:1px solid #f59e0b;border-radius:12px 12px 0 0;padding:10px 12px;display:flex;align-items:center;gap:8px;">
        <strong style="color:#c2410c">Ms Trang AI</strong>
        <span style="margin-left:auto;font-size:12px;color:#666">Trợ lý học tiếng Anh</span>
      </div>
      <div id="chat-body" style="height:300px;overflow:auto;background:#fff;border:1px solid #eee;border-top:0;padding:12px;display:flex;flex-direction:column;gap:8px;"></div>
      <div style="display:flex;gap:8px;border:1px solid #f0f0f0;border-top:0;padding:10px;background:#fff;border-radius:0 0 12px 12px;">
        <input id="chat-input" placeholder="Hỏi AI bằng tiếng Việt hoặc tiếng Anh..." style="flex:1;padding:8px;border:1px solid #e5e7eb;border-radius:8px;" />
        <button id="chat-send" style="background:#f97316;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer">Gửi</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    return {
      bodyEl: wrapper.querySelector("#chat-body"),
      inputEl: wrapper.querySelector("#chat-input"),
      sendBtn: wrapper.querySelector("#chat-send"),
    };
  }

  function appendMessage(container, who, text) {
    const el = document.createElement("div");
    el.style = "display:flex;gap:8px;align-items:flex-start;";
    if (who === "user") {
      el.innerHTML = `<div style="margin-left:auto;max-width:80%;background:#fdedd5;padding:8px;border-radius:10px;color:#7a2e0f"><strong style="font-size:12px">Bạn:</strong><div style="margin-top:6px">${escapeHtml(text)}</div></div>`;
    } else {
      el.innerHTML = `<div style="max-width:80%;background:#f8fafc;padding:10px;border-radius:10px;border:1px solid #e6eef6;color:#0f172a"><strong style="font-size:12px;color:#0ea5e9">AI:</strong><div style="margin-top:6px">${escapeHtml(text)}</div></div>`;
    }
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping(container) {
    const el = document.createElement("div");
    el.className = "ai-typing";
    el.innerHTML = `<div style="max-width:80%;background:#f8fafc;padding:8px;border-radius:10px;border:1px solid #e6eef6;color:#0f172a"><em>AI đang trả lời...</em></div>`;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    return el;
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  // --- Init widget ---
  const { bodyEl, inputEl, sendBtn } = createChatWidget();

  async function askServer(prompt) {
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server lỗi ${res.status}: ${txt}`);
      }
      const json = await res.json();
      return json.reply || "(không có phản hồi)";
    } catch (err) {
      console.error("Lỗi gọi server:", err);
      throw err;
    }
  }

  async function handleSend() {
    const prompt = inputEl.value.trim();
    if (!prompt) return;
    appendMessage(bodyEl, "user", prompt);
    inputEl.value = "";
    const typingEl = showTyping(bodyEl);
    try {
      const reply = await askServer(prompt);
      typingEl.remove();
      appendMessage(bodyEl, "ai", reply);
    } catch (err) {
      typingEl.remove();
      appendMessage(bodyEl, "ai", "Có lỗi khi gọi AI. Vui lòng thử lại sau.");
    }
  }

  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  console.log("✅ gemini-ui.js loaded");
})();
