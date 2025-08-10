async function callGemini() {
  const apiKey = "AIzaSyCZq9_AOpXISNHjUmRjLak8n5eUQS-QnXA";

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
  console.log(data.candidates[0].content.parts[0].text);
}

callGemini();
