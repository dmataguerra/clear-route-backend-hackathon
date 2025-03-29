const express = require('express');
const estados_formulario = express.Router();
const db = require('../config/database');

// Crear un estado de formulario
estados_formulario.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const { codigo, descripcion } = req.body;

  if (codigo && descripcion) {
    let query = `INSERT INTO estados_formulario (codigo, descripcion) VALUES ('${codigo}', '${descripcion}')`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Estado de formulario insertado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todos los estados de formulario
estados_formulario.get("/", async (req, res, next) => {
  const query = `SELECT * FROM estados_formulario`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Estados de formulario encontrados", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron estados de formulario" });
});

// Obtener un estado de formulario por código
estados_formulario.get("/:codigo", async (req, res, next) => {
  const codigo = req.params.codigo;
  try {
    const estado = await db.query("SELECT * FROM estados_formulario WHERE codigo = ?", [codigo]);
    if (estado.length > 0) {
      return res.status(200).json({ code: 200, message: "Estado de formulario encontrado", data: estado });
    }
    return res.status(404).json({ code: 404, message: "Estado de formulario no encontrado" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar un estado de formulario por código
estados_formulario.put("/:codigo", async (req, res, next) => {
  const codigo = req.params.codigo;
  const { descripcion } = req.body;

  if (descripcion) {
    let query = `UPDATE estados_formulario SET descripcion = '${descripcion}' WHERE codigo = '${codigo}'`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Estado de formulario actualizado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar un estado de formulario por código
estados_formulario.delete("/:codigo", async (req, res, next) => {
  const codigo = req.params.codigo;
  const query = `DELETE FROM estados_formulario WHERE codigo = '${codigo}'`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Estado de formulario eliminado correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Estado de formulario no encontrado" });
});

module.exports = estados_formulario;