const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const salas = {};

app.get("/create-room", (req, res) => {
  const codigo = generarCodigoSala();

  salas[codigo] = {
    code: codigo,
    createdAt: new Date(),
    users: []
  };

  console.log("Sala creada:", codigo);

  res.json({
    roomCode: codigo
  });
});

app.post("/join-room", (req, res) => {
  const { roomCode, userName } = req.body;

  if (!roomCode) {
    return res.status(400).json({
      success: false,
      message: "No se recibió el código."
    });
  }

  const sala = salas[roomCode.toUpperCase()];

  if (!sala) {
    return res.status(404).json({
      success: false,
      message: "La sala no existe."
    });
  }

  const usuario = {
    id: Date.now(),
    name: userName || "Invitado"
  };

  sala.users.push(usuario);

  console.log(
    usuario.name,
    "entró en",
    sala.code,
    "- Usuarios:",
    sala.users.length
  );

  res.json({
    success: true,
    room: sala,
    user: usuario
  });
});

app.get("/room/:code", (req, res) => {

  const codigo = req.params.code.toUpperCase();

  const sala = salas[codigo];

  if (!sala) {
    return res.status(404).json({
      success: false
    });
  }

  res.json({
    success: true,
    room: sala
  });

});

function generarCodigoSala() {

  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let codigo = "";

  for (let i = 0; i < 6; i++) {
    codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
  }

  return codigo;
}

const PORT = 3001;

app.listen(PORT, () => {

  console.log("");
  console.log("=================================");
  console.log("🚀 Club de Amigos Backend");
  console.log("=================================");
  console.log("Servidor: http://localhost:3001");
  console.log("");

});