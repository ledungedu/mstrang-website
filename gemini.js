async function callGemini() {
  const apiKey = "AIzaSyCZq9_AOpXISNHjUmRjLak8n5eUQS-QnXA";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Explain how AI works in a few words" }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    console.log("✅ API response:", data);

    if (data.candidates && data.candidates.length > 0) {
      console.log("💡 Gemini says:", data.candidates[0].content.parts[0].text);
    } else {
      console.warn("⚠️ No content returned");
    }
  } catch (error) {
    console.error("❌ API call failed:", error);
  }
}

callGemini();
console.log("✅ gemini.js đã load thành công!");
alert("Gemini script loaded!");
