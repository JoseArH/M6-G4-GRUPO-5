const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const yargs = require('yargs');

const argv = yargs.option('key', {
    alias: 'k',
    description: 'Clave para iniciar el servidor',
    type: 'number',
    demandOption: true
}).argv;

if (argv.key !== 123) {
    console.log('Clave incorrecta. No se puede iniciar el servidor.');
    process.exit(1);
}

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/minino', async (req, res) => {
    try {
        const url = req.body.urlimagen;

        const imagen = await axios({
            url: url,
            responseType: 'arraybuffer'
        });

        const imagenProcesada = await sharp(imagen.data).greyscale().toBuffer();

        const ruta = path.join(__dirname, 'public', 'migatito.jpg');

        await fs.writeFile(ruta, imagenProcesada);

        res.redirect('/ver-imagen');
    } catch (error) {
        console.error('Error procesando la imagen:', error);
        res.status(500).send('Error procesando la imagen.');
    }
});

app.get('/ver-imagen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mostrar-imagen.html'));
});

app.listen(3000, () => {
    console.log('Servidor dedicado corriendo en el puerto 3000');
});
