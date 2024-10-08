// index.js
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const config = require('./config/config.json');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const fileUpload = require('express-fileupload')


const app = express();

const PORT = process.env.PORT || 3000;

// Configuración de Sequelize
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../Archivos');

    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());

// Rutas
const usuarioRoutes = require('./routes/usuarioroutes');
const cursoRoutes = require('./routes/cursoroutes');
const contenidoRoutes = require('./routes/contenidoroutes');
const temaRoutes = require('./routes/temaRoutes');
const configuracionRoutes = require('./routes/configuracionRoutes'); 
const configuracionEjercicioRoutes = require('./routes/configuracionejercicioroutes');
const archivoRoutes = require('./routes/archivoRoutes');
const formulaRoutes = require('./routes/formularoutes');
const graficoRoutes = require('./routes/graficoroutes');  
const parametroRoutes = require('./routes/parametroroutes'); 
const seleccionRoutes = require('./routes/puntosroutes'); 
const contenidoEjercicioRoutes = require('./routes/contenidoejercicioroutes'); 
const variableRoutes = require('./routes/variableroutes'); 
const enlaceRoutes = require('./routes/enlaceRoutes');
const archivoEjercicio = require('./routes/archivoEjerciciosRoutes');
const temaDetailsRoutes = require('./routes/temaDetailsRoutes');

app.use(cors()); 
app.use(fileUpload())

app.use('/api/temaDetalles', temaDetailsRoutes);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/contenidos', contenidoRoutes);
app.use('/api/temas', temaRoutes);
app.use('/api/configuraciones', configuracionRoutes); 
app.use('/api/configuracionejercicios', configuracionEjercicioRoutes);
app.use('/api/archivos', archivoRoutes);
app.use('/api/enlaces', enlaceRoutes);
app.use('/api/formulas', formulaRoutes);
app.use('/api/graficos', graficoRoutes);
app.use('/api/parametros', parametroRoutes);
app.use('/api/puntos', seleccionRoutes); 
app.use('/api/contenidoejercicios', contenidoEjercicioRoutes); 
app.use('/api/variables', variableRoutes); 
app.use('/api/archivoejercicios', archivoEjercicio);

app.use('/Archivos', express.static(path.join(__dirname, 'Archivos')));
app.use('/ArchivosEjercicios', express.static(path.join(__dirname, 'ArchivosEjercicios')));


// index.js (modifica la ruta existente)

app.get('/api/read-csv', (req, res) => {
  const fileName = req.query.fileName;
  if (!fileName) {
    return res.status(400).send('El nombre del archivo es necesario.');
  }

  const filePath = path.join(__dirname, 'ArchivosEjercicios', fileName);
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (error) => {
      res.status(500).send('Error al leer el archivo CSV');
    });
});


// Subida de archivos generales
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: 'No files were uploaded.' });
  }
  const files = req.files.file;
  if (!files) {
    return res.status(400).send({ message: 'Archivo no subido correctamente.' });
  }

  const fileArray = Array.isArray(files) ? files : [files];
  const folderPath = path.join(__dirname, 'Archivos');

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  fileArray.forEach((file) => {
    const filePath = path.join(folderPath, file.name);
    console.log('filePath:', filePath);

    file.mv(filePath, (err) => {
      if (err) {
        console.error('Error al mover el archivo:', err);
        return res.status(500).send({ message: 'Error al subir uno de los archivos.' });
      }
    });
  });

  return res.status(200).send({ message: 'Files uploaded successfully' });
});

// Subida de archivos de ejercicios
app.post('/uploadEjercicios', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: 'No files were uploaded.' });
  }
  const files = req.files.file;
  if (!files) {
    return res.status(400).send({ message: 'Archivo de ejercicios no subido correctamente.' });
  }

  const fileArray = Array.isArray(files) ? files : [files];
  const folderPath = path.join(__dirname, 'ArchivosEjercicios');

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  fileArray.forEach((file) => {
    const filePath = path.join(folderPath, file.name);
    console.log('filePath:', filePath);

    file.mv(filePath, (err) => {
      if (err) {
        console.error('Error al mover el archivo de ejercicios:', err);
        return res.status(500).send({ message: 'Error al subir uno de los archivos de ejercicios.' });
      }
    });
  });

  return res.status(200).send({ message: 'Archivos de ejercicios subidos exitosamente' });
});


// Middleware para manejar errores de ruta no encontrada
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
