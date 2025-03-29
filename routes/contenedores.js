const express = require('express');
const contenedores = express.Router();
const db = require('../config/database');

// Crear un contenedor
contenedores.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const {id, cr_ubicacion, cr_codigo_qr } = req.body;

  if (id, cr_ubicacion && cr_codigo_qr) {
    let query = `INSERT INTO contenedores (id, cr_ubicacion, cr_codigo_qr) VALUES (${id} , '${cr_ubicacion}', '${cr_codigo_qr}')`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Contenedor insertado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todos los contenedores
contenedores.get("/", async (req, res, next) => {
  const query = `SELECT * FROM contenedores`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Contenedores encontrados", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron contenedores" });
});

// Obtener un contenedor por ID
contenedores.get("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const contenedor = await db.query("SELECT * FROM contenedores WHERE id = ?", [id]);
    if (contenedor.length > 0) {
      return res.status(200).json({ code: 200, message: "Contenedor encontrado", data: contenedor });
    }
    return res.status(404).json({ code: 404, message: "Contenedor no encontrado" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar un contenedor por ID
contenedores.put("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { cr_ubicacion, cr_codigo_qr } = req.body;

  if (cr_ubicacion && cr_codigo_qr) {
    let query = `UPDATE contenedores SET cr_ubicacion = '${cr_ubicacion}', cr_codigo_qr = '${cr_codigo_qr}' WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Contenedor actualizado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar un contenedor por ID
contenedores.delete("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM contenedores WHERE id = ${id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Contenedor eliminado correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Contenedor no encontrado" });
});

module.exports = contenedores;