// routes/enlaceroutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Enlace = require('../models/enlaces')(sequelize, Sequelize);

// GET todos los enlaces
router.get('/', async (req, res) => {
  try {
    const enlaces = await Enlace.findAll();
    res.status(200).json(enlaces);
  } catch (error) {
    console.error('Error al obtener enlaces:', error);
    res.status(500).json({ error: 'Error al obtener enlaces' });
  }
});

// GET un enlace por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const enlaces = await Enlace.findByPk(id);
    if (enlaces) {
      res.status(200).json(enlaces);
    } else {
      res.status(404).json({ error: 'Enlace no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener enlace por ID:', error);
    res.status(500).json({ error: 'Error al obtener enlaces por ID' });
  }
});

// POST para agregar un nuevo Enlace
router.post('/', async (req, res) => {
    const { idTema, enlace } = req.body;
  
    try {
      const newEnlace = await Enlace.create({ idTema, enlace });
      res.status(201).json(newEnlace);
    } catch (error) {
      console.error('Error al crear enlace:', error.message);
      res.status(500).json({ error: 'Error al crear enlace' });
    }
  });


// PUT para actualizar un Enlace existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { idTema, enlaces } = req.body;
  try {
    const enlaceToUpdate = await Enlace.findByPk(id);
    if (enlaceToUpdate) {
        enlaceToUpdate.idTema = idTema;
        enlaceToUpdate.Enlace = enlaces;
      
      await enlaceToUpdate.save();
      res.status(200).json(enlaceToUpdate);
    } else {
      res.status(404).json({ error: 'Enlace no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar enlace:', error);
    res.status(500).json({ error: 'Error al actualizar enlace' });
  }
});

// DELETE para eliminar un Enlace por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const enlaceToDelete = await Enlace.findByPk(id);
    if (enlaceToDelete) {
      await enlaceToDelete.destroy();
      res.status(200).json({ message: 'Enlace eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Enlace no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar enlace:', error);
    res.status(500).json({ error: 'Error al eliminar enlace' });
  }
});

module.exports = router;
