const express = require('express');
const rutasContenedores = express.Router();
const db = require('../config/database');

// Crear una relación ruta-contenedor
rutasContenedores.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const ruta_id = req.body['ruta-id']; // Mapea la clave con guión
  const contenedor_id = req.body.contenedor_id;

  if (ruta_id && contenedor_id) {
    let query = `INSERT INTO rutas_contenedores (ruta_id, contenedor_id) VALUES (${ruta_id}, ${contenedor_id})`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Relación ruta-contenedor insertada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todas las relaciones ruta-contenedor
rutasContenedores.get("/", async (req, res, next) => {
  const query = `SELECT * FROM rutas_contenedores`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Relaciones ruta-contenedor encontradas", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron relaciones ruta-contenedor" });
});

// Obtener una relación ruta-contenedor por ruta_id
rutasContenedores.get("/:ruta_id([0-9]{1,11})", async (req, res, next) => {
  const ruta_id = parseInt(req.params.ruta_id, 10);
  try {
    const relacion = await db.query("SELECT * FROM rutas_contenedores WHERE ruta_id = ?", [ruta_id]);
    if (relacion.length > 0) {
      return res.status(200).json({ code: 200, message: "Relación ruta-contenedor encontrada", data: relacion });
    }
    return res.status(404).json({ code: 404, message: "Relación ruta-contenedor no encontrada" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar una relación ruta-contenedor por ruta_id
rutasContenedores.put("/:ruta_id([0-9]{1,11})", async (req, res, next) => {
  const ruta_id = parseInt(req.params.ruta_id, 10);
  const { contenedor_id } = req.body;

  if (contenedor_id) {
    let query = `UPDATE rutas_contenedores SET contenedor_id = ${contenedor_id} WHERE ruta_id = ${ruta_id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Relación ruta-contenedor actualizada correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar una relación ruta-contenedor por ruta_id
rutasContenedores.delete("/:ruta_id([0-9]{1,11})", async (req, res, next) => {
  const ruta_id = parseInt(req.params.ruta_id, 10);
  const query = `DELETE FROM rutas_contenedores WHERE ruta_id = ${ruta_id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Relación ruta-contenedor eliminada correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Relación ruta-contenedor no encontrada" });
});

module.exports = rutasContenedores;