const express = require('express');
const sensores = express.Router();
const db = require('../config/database');

// Crear un sensor
sensores.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const { id , contenedor_id } = req.body;

  if (id && contenedor_id) {
    let query = `INSERT INTO sensores (id , contenedor_id) VALUES (${id} , ${contenedor_id})`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Sensor insertado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todos los sensores
sensores.get("/", async (req, res, next) => {
  const query = `SELECT * FROM sensores`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Sensores encontrados", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron sensores" });
});

// Obtener un sensor por ID
sensores.get("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const sensor = await db.query("SELECT * FROM sensores WHERE id = ?", [id]);
    if (sensor.length > 0) {
      return res.status(200).json({ code: 200, message: "Sensor encontrado", data: sensor });
    }
    return res.status(404).json({ code: 404, message: "Sensor no encontrado" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar un sensor por ID
sensores.put("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { contenedor_id } = req.body;

  if (contenedor_id) {
    let query = `UPDATE sensores SET contenedor_id = ${contenedor_id} WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Sensor actualizado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar un sensor por ID
sensores.delete("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM sensores WHERE id = ${id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Sensor eliminado correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Sensor no encontrado" });
});

module.exports = sensores;