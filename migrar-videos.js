// Script de migración: sube todos los videos del Excel a Firebase Realtime Database
const XLSX = require('xlsx');
const https = require('https');

// Leer el Excel
const wb = XLSX.readFile('./Evidencias Ficha 3186645.xlsx');
const ws = wb.Sheets['Videos'];
const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Construir lista de videos (saltando la cabecera)
const videos = json.slice(1)
    .map(row => ({ titulo: (row[0] || '').trim(), url: (row[1] || '').trim(), instructor: (row[2] || 'SENA').trim() }))
    .filter(v => v.titulo && v.url);

console.log(`📦 Encontrados ${videos.length} videos en el Excel. Subiendo a Firebase...`);

// Usamos la REST API de Firebase Realtime Database (no requiere credenciales de admin en modo de prueba)
const DB_URL = 'sena-taskmanager-2026-default-rtdb.firebaseio.com';

function pushVideo(video) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(video);
        const options = {
            hostname: DB_URL,
            path: '/videos.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function migrar() {
    let ok = 0;
    for (const v of videos) {
        try {
            await pushVideo(v);
            ok++;
            process.stdout.write(`\r✅ ${ok}/${videos.length} videos subidos...`);
        } catch (e) {
            console.error(`\n❌ Error con: ${v.titulo}`, e.message);
        }
    }
    console.log(`\n\n🎉 ¡Migración completada! ${ok} videos ahora están en Firebase.`);
}

migrar();
