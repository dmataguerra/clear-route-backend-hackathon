const express = require('express');//Importar express como Clase
const app = express(); //lamar el constructor de express
const morgan = require('morgan');
const conductores = require('./routes/conductores.js');
const contenedores = require('./routes/contenedores.js');
const estados_formulario = require('./routes/estados_formulario.js');
const formularios = require('./routes/formularios.js');
const lecturas = require('./routes/lecturas.js');
const rutasContenedores = require('./routes/rutas_contenedores.js');
const rutas = require('./routes/rutas.js');

const sensores = require('./routes/sensores.js');
const tareas = require('./routes/tareas.js');


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/", (req, res, next) => {
  return res.status(200).json({code : 1, message : "Bienvenido a ClearRoute"});
});

app.use("/conductores", conductores);
app.use("/contenedores", contenedores);
app.use("/estados_formulario", estados_formulario);
app.use("/formularios", formularios);
app.use("/lecturas", lecturas);
app.use("/rutas_contenedores", rutasContenedores);
app.use("/rutas", rutas);
app.use("/sensores", sensores);
app.use("/tareas", tareas);

app.use((req , res, next) => {
  return res.status(404).json({code : 404, message : "URL no encontrada"});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...')});
