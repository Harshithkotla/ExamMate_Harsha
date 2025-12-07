import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { subject, question, marks } = req.body;

  try {
    const OPENROUTER_KEY = "YOUR_KEY_HERE";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
Write plain notebook answers, no markdown, student style.
`
          },
          {
            role: "user",
            content: `Subject: ${subject}\nQuestion: ${question}\nMarks: ${marks}`
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices[0].message.content });

  } catch (e) {
    res.status(500).json({ answer: "Server Error" });
  }
}
