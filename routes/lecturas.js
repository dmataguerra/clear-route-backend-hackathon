const express = require('express');
const lecturas = express.Router();
const db = require('../config/database');

// Crear una lectura
lecturas.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const {id,  cr_fecha, cr_distancia } = req.body;

  if (id  && cr_fecha && cr_distancia) {
    let query = `INSERT INTO lecturas (id , cr_fecha, cr_distancia) VALUES (${id} , '${cr_fecha}', ${cr_distancia})`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Lectura insertada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todas las lecturas
lecturas.get("/", async (req, res, next) => {
  const query = `SELECT * FROM lecturas`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Lecturas encontradas", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron lecturas" });
});

// Obtener una lectura por ID
lecturas.get("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const lectura = await db.query("SELECT * FROM lecturas WHERE id = ?", [id]);
    if (lectura.length > 0) {
      return res.status(200).json({ code: 200, message: "Lectura encontrada", data: lectura });
    }
    return res.status(404).json({ code: 404, message: "Lectura no encontrada" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar una lectura por ID
lecturas.put("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { cr_fecha, cr_distancia } = req.body;

  if (cr_fecha && cr_distancia) {
    let query = `UPDATE lecturas SET cr_fecha = '${cr_fecha}', cr_distancia = ${cr_distancia} WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Lectura actualizada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar una lectura por ID
lecturas.delete("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM lecturas WHERE id = ${id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Lectura eliminada correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Lectura no encontrada" });
});

module.exports = lecturas;