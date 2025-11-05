const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.proxyNotify = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send('');
  }

  try {
    const { url, data } = req.body;
    if (!url || !data) {
      return res.status(400).send({ error: "Faltan parámetros: url o data" });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    return res.status(200).send({ result: text });
  } catch (error) {
    console.error("❌ Error al reenviar notificación:", error);
    return res.status(500).send({ error: "Error al enviar notificación" });
  }
});
