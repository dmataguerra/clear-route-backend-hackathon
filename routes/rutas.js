const express = require('express');
const rutas = express.Router();
const db = require('../config/database');

// Crear una ruta
rutas.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const { id ,cr_fecha, cr_ruta, conductor_id } = req.body;

  if (id && cr_fecha && cr_ruta && conductor_id) {
    let query = `INSERT INTO rutas (id , cr_fecha, cr_ruta, conductor_id) VALUES (${id},'${cr_fecha}', '${cr_ruta}', ${conductor_id})`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Ruta insertada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todas las rutas
rutas.get("/", async (req, res, next) => {
  const query = `SELECT * FROM rutas`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Rutas encontradas", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron rutas" });
});

// Obtener una ruta por ID
rutas.get("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const ruta = await db.query("SELECT * FROM rutas WHERE id = ?", [id]);
    if (ruta.length > 0) {
      return res.status(200).json({ code: 200, message: "Ruta encontrada", data: ruta });
    }
    return res.status(404).json({ code: 404, message: "Ruta no encontrada" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar una ruta por ID
rutas.put("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { cr_fecha, cr_ruta, conductor_id } = req.body;

  if (cr_fecha && cr_ruta && conductor_id) {
    let query = `UPDATE rutas SET cr_fecha = '${cr_fecha}', cr_ruta = '${cr_ruta}', conductor_id = ${conductor_id} WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Ruta actualizada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar una ruta por ID
rutas.delete("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM rutas WHERE id = ${id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Ruta eliminada correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Ruta no encontrada" });
});

module.exports = rutas;