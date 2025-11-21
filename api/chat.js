export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message } = req.body;

  const sistema = `
Você é o Hubinho, o assistente virtual oficial da AlugaHub. 
(Suas instruções completas aqui)
`;

  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.CHAVE_API,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: sistema }]
            },
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800
          }
        })
      }
    );

    const json = await resposta.json();
    return res.status(200).json(json);

  } catch (err) {
    console.error("ERRO:", err);
    return res.status(500).json({ error: "Falha no servidor" });
  }
}