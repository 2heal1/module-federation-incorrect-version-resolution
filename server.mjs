import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {generateSnapshotFromManifest,composeKeyWithSeparator} from '@module-federation/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const generateSnapshot = async ()=>{
    const hostManifest = await readManifest(path.join(__dirname, '/public/build-legacy/mf-manifest.json'));
    const hostSnapshot = generateSnapshotFromManifest(hostManifest);
    const remoteManifest = await readManifest(path.join(__dirname, '/public/build-next/mf-manifest.json'))
    const remoteSnapshot = generateSnapshotFromManifest(remoteManifest);

    const remoteMatchedVersion = hostSnapshot.remotesInfo[remoteManifest.name].matchedVersion

    return {
        [hostManifest.name]: hostSnapshot,
        [composeKeyWithSeparator(remoteManifest.name,remoteMatchedVersion)]: remoteSnapshot,
    }
}

const readManifest = (path) => {
    return new Promise((resolve) => {
        fs.readFile(path, 'utf-8', (e, data) => {
            if (e) {
                console.error('An error occurred reading the file', e)
                resolve({})
            } else if (data) {
                resolve(JSON.parse(data))
            } else {
                console.error('Unexpected empty buffer')
                resolve({})
            }
        })
    })
}

app.use(cors())
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/build-next/mf-manifest.json', function(req, res){
    res.sendFile(path.join(__dirname, '/public/build-next/mf-manifest.json'));
})

app.get('/', async (_, response) => {
    const manifestLegacy = await readManifest(path.join(__dirname, '/public/build-legacy/manifest.json'))
    const manifestNext = await readManifest(path.join(__dirname, '/public/build-next/manifest.json'));
    const mfSnapshot = await generateSnapshot();
    response.send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>module-federation-reproduction</title>
    <script id='mf-snapshot' type='application/json'>${JSON.stringify(mfSnapshot)}</script>
    <script src="${manifestLegacy['public/build-legacy/runtime.js']}"></script>
    <script src="${manifestLegacy['public/build-legacy/vendor.js']}"></script>
    <script src="${manifestLegacy['public/build-legacy/tiny-emitter.js']}"></script>
    <script src="${manifestNext['public/build-next/runtime.js']}"></script>
    <script src="${manifestNext['public/build-next/remote.js']}"></script>
    <script src="${manifestLegacy['public/build-legacy/app.js']}"></script>
    <script src="${manifestLegacy['public/build-legacy/vendor.js']}"></script>
</head>
<body>
<h1>module-federation-reproduction</h1>
<p>See console</p>
</body>
</html>`)
})

const port = process.env.SERVER_PORT || 80
const server = app.listen(port, () => {
    console.log('Serving on port ' + port)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server has been stopped')
        process.exit(0)
    })
})
