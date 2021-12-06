const express = require("express");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");

let consultas = [];

const HTML_DIR = path.join(__dirname, "/");
app.use(express.static(HTML_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/api/consulta", (req, res) => {
  const consulta = {
    nombre: req.body.nombre,
    edad: req.body.edad,
    alergias: req.body.alergias,
    correo: req.body.correo,
    telefono: req.body.telefono,
    doctor: req.body.doctor,
    antecedente: req.body.antecedente,
    tipo: req.body.tipo,
    dia: req.body.dia,
    hora: req.body.hora,
  };

  asesorias.push(consulta);
  console.log(consultas);
  res.json(consulta);
});

app.listen(3000, () => {
  console.log("Server on port: ", 3000);
});
