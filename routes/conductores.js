const express = require ('express');
const conductores = express.Router();
const db = require('../config/database');

conductores.post("/", async (req, res, next) => {
  console.log(req.body); // Verifica los datos recibidos
  const {id, cr_nombre, cr_correo, cr_contrasenia} = req.body;

  if(id && cr_nombre && cr_correo && cr_contrasenia){
    let query = `INSERT INTO conductores (id, cr_nombre, cr_correo, cr_contrasenia) VALUES (${id}, '${cr_nombre}', '${cr_correo}', '${cr_contrasenia}')`;
    const rows = await db.query(query);
    if(rows.affectedRows == 1){
      return res.status(201).json({code : 201, message : "Conductor insertado correctamente"});
    }
    return res.status(500).json({code : 500, message : "Ocurrió un error"});
  }
  return res.status(500).json({code : 500, message : "Campos incompletos"});
});

conductores.get("/", async (req, res, next) => {
  const query = `SELECT * FROM conductores`;
  const rows = await db.query(query);
  if(rows.length > 0){
    return res.status(200).json({code : 200, message : "Conductores encontrados", data : rows});
  }
  return res.status(404).json({code : 404, message : "No se encontraron conductores"});
});

conductores.get("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    const conductin = await db.query("SELECT * FROM conductores WHERE id = ?", [id]);
    return res.status(200).json({code : 1, message : conductin});
  } catch (error) {
    return res.status(404).json({code : 404, message : "Conductor no encontrado"});
  }
});

conductores.put("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const {cr_nombre, cr_correo, cr_contrasenia} = req.body;
  if(cr_nombre && cr_correo && cr_contrasenia){
    let query = `UPDATE conductores SET cr_nombre = '${cr_nombre}', cr_correo = '${cr_correo}', cr_contrasenia = '${cr_contrasenia}' WHERE id = ${id}`;
    const rows = await db.query(query);
    if(rows.affectedRows == 1){
      return res.status(200).json({code : 200, message : "Conductor actualizado correctamente"});
    }
    return res.status(500).json({code : 500, message : "Ocurrió un error"});
  }
  return res.status(500).json({code : 500, message : "Campos incompletos"});
});

conductores.delete("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const query = `DELETE FROM conductores WHERE id = ${id}`;
  const rows = await db.query(query);
  if(rows.affectedRows == 1){
    return res.status(200).json({code : 200, message : "Conductor eliminado correctamente"});
  }
  return res.status(404).json({code : 404, message : "Conductor no encontrado"});
});

module.exports = conductores;
