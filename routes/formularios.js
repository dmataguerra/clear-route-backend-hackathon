const express = require('express');
const formularios = express.Router();
const db = require('../config/database');

// Crear un formulario
formularios.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const { id ,cr_fecha, cr_estado, cr_descripcion, contenedor_id } = req.body;

  if (id && cr_fecha && cr_estado && contenedor_id) {
    let query = `INSERT INTO formularios (id , cr_fecha, cr_estado, cr_descripcion, contenedor_id) VALUES (${id} , '${cr_fecha}', '${cr_estado}', '${cr_descripcion || null}', ${contenedor_id})`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(201).json({ code: 201, message: "Formulario insertado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Obtener todos los formularios
formularios.get("/", async (req, res, next) => {
  const query = `SELECT * FROM formularios`;
  const rows = await db.query(query);
  if (rows.length > 0) {
    return res.status(200).json({ code: 200, message: "Formularios encontrados", data: rows });
  }
  return res.status(404).json({ code: 404, message: "No se encontraron formularios" });
});

// Obtener un formulario por ID
formularios.get("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const formulario = await db.query("SELECT * FROM formularios WHERE id = ?", [id]);
    if (formulario.length > 0) {
      return res.status(200).json({ code: 200, message: "Formulario encontrado", data: formulario });
    }
    return res.status(404).json({ code: 404, message: "Formulario no encontrado" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
});

// Actualizar un formulario por ID
formularios.put("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { cr_estado, cr_descripcion, contenedor_id } = req.body;

  if (cr_estado && contenedor_id) {
    let query = `UPDATE formularios SET cr_estado = '${cr_estado}', cr_descripcion = '${cr_descripcion || null}', contenedor_id = ${contenedor_id} WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
      return res.status(200).json({ code: 200, message: "Formulario actualizado correctamente" });
    }
    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar un formulario por ID
formularios.delete("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM formularios WHERE id = ${id}`;
  const rows = await db.query(query);
  if (rows.affectedRows == 1) {
    return res.status(200).json({ code: 200, message: "Formulario eliminado correctamente" });
  }
  return res.status(404).json({ code: 404, message: "Formulario no encontrado" });
});

module.exports = formularios;