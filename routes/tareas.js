const express = require('express');
const tareas = express.Router();
const db = require('../config/database');

tareas.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const {id , cr_estado, cr_descripcion, fecha_asignacion, fecha_completado } = req.body;

  if (id && cr_estado && fecha_asignacion) {
    let query = `INSERT INTO tareas (id , cr_estado, cr_descripcion, fecha_asignacion, fecha_completado) VALUES (${id} , ${cr_estado}, '${cr_descripcion || null}', '${fecha_asignacion}', '${fecha_completado || null}')`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Tarea insertada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

tareas.get("/", async (req, res, next) => {
  const query = `SELECT * FROM tareas`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Tareas encontradas", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron tareas" });
});

tareas.get("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const tarea = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
    if (tarea.length > 0) {
      return res.status(200).json({ code: 200, message: "Tarea encontrada", data: tarea });
    }
    return res.status(404).json({ code: 404, message: "Tarea no encontrada" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

tareas.put("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { cr_estado, cr_descripcion, fecha_completado } = req.body;

  if (cr_estado) {
    let query = `UPDATE tareas SET cr_estado = ${cr_estado}, cr_descripcion = '${cr_descripcion || null}', fecha_completado = '${fecha_completado || null}' WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Tarea actualizada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

tareas.delete("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM tareas WHERE id = ${id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Tarea eliminada correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Tarea no encontrada" });
});

module.exports = tareas;