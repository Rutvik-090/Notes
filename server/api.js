import fetch from "node-fetch";

export async function handler(req, res) {
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
  const response = await fetch("https://api-inference.huggingface.co/models/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
}
