// routes/archivoroutes.js
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const config = require("../config/config.json");
const sequelize = new Sequelize(
  config.integradora.database,
  config.integradora.username,
  config.integradora.password,
  {
    host: config.integradora.host,
    dialect: "mysql",
  }
);
const Archivo = require("../models/archivo")(sequelize, Sequelize);

// GET todos los archivos
router.get("/", async (req, res) => {
  try {
    const archivos = await Archivo.findAll();
    res.status(200).json(archivos);
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    res.status(500).json({ error: "Error al obtener archivos" });
  }
});

// GET un archivo por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const archivo = await Archivo.findByPk(id);
    if (archivo) {
      res.status(200).json(archivo);
    } else {
      res.status(404).json({ error: "Archivo no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener archivo por ID:", error);
    res.status(500).json({ error: "Error al obtener archivo por ID" });
  }
});
// GET archivos por temaId
router.get("/tema/:temaId", async (req, res) => {
  const { temaId } = req.params;
  try {
    const archivos = await Archivo.findAll({
      where: { idTema: temaId }, 
    });

    if (archivos.length > 0) {
      res.status(200).json(archivos);
    } else {
      res.status(200).json([]);  
    }
  } catch (error) {
    console.error("Error al obtener archivos por temaId:", error);
    res.status(500).json({ error: "Error al obtener archivos por temaId" });
  }
});

// POST para agregar un nuevo archivo
router.post("/", async (req, res) => {
  const { idTema, archivo, descripcion } = req.body;

  try {
    const newArchivo = await Archivo.create({ idTema, archivo, descripcion });
    res.status(201).json(newArchivo);
  } catch (error) {
    console.error("Error al crear archivo:", error.message);
    res.status(500).json({ error: "Error al crear archivo" });
  }
});

// PUT para actualizar un archivo existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { idTema, archivo, descripcion } = req.body;
  try {
    const archivoToUpdate = await Archivo.findByPk(id);
    if (archivoToUpdate) {
      archivoToUpdate.idTema = idTema;
      archivoToUpdate.archivo = archivo;
      archivoToUpdate.descripcion = descripcion;
      await archivoToUpdate.save();
      res.status(200).json(archivoToUpdate);
    } else {
      res.status(404).json({ error: "Archivo no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar archivo:", error);
    res.status(500).json({ error: "Error al actualizar archivo" });
  }
});

// DELETE para eliminar un archivo por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const archivoToDelete = await Archivo.findByPk(id);
    if (archivoToDelete) {
      await archivoToDelete.destroy();
      res.status(200).json({ message: "Archivo eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Archivo no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    res.status(500).json({ error: "Error al eliminar archivo" });
  }
});

module.exports = router;
