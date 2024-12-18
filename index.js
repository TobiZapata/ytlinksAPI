const express = require("express");
const linksLogic = require("./linksLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API para youtube links hecho con Render");
});

app.post("/links", async (req, res) => {
  try {
    const { channelLink } = req.body;

    if (!channelLink || !channelLink.startsWith("https://www.youtube.com/")) {
      return res
        .status(400)
        .json({ error: "Proporciona un enlace válido de YouTube." });
    }
    const result = await linksLogic(channelLink);

    res.json({ result });
  } catch (error) {
    console.error("Error en la ruta /links:", error);
    res.status(500).json({ error: "Hubo un problema al obtener los videos." });
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
