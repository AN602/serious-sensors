import * as express from "express";
import * as https from "https";
import * as WebSocket from "ws";
import * as path from 'path';
import * as fs from 'fs';

const distFolder = path.join(process.cwd(), 'dist');

const indexHtml = path.join(distFolder, 'index.html');
const masterHtml = path.join(distFolder, 'master.html');
const slaveHtml = path.join(distFolder, 'slave.html');

const assetsFolder = path.join(distFolder, 'assets');

console.log(`Setup folders: ${JSON.stringify({ dist: distFolder, assets: assetsFolder }, null, 4)}`)

let privateKey = fs.readFileSync(path.join(distFolder, 'key.pem'), 'utf8');
let certificate = fs.readFileSync(path.join(distFolder, 'cert.pem'), 'utf8');
let credentials = { key: privateKey, cert: certificate };

const app = express();

app.get('/', (req, res) => {
    res.sendFile(indexHtml);
});

app.get('/master', (req, res) => {
    res.sendFile(masterHtml);
});

app.get('/slave', (req, res) => {
    res.sendFile(slaveHtml);
});

app.use(express.static(distFolder));

//initialize a simple http server
const server = https.createServer(credentials, app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let clients: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
    clients.push(ws);

    console.log("connection established");

    //connection is up, let's add a simple simple event
    ws.on("message", (message: string) => {
        //log the received message and send it back to the client
        console.log(message);
        for (var i = 0; i < clients.length; i++) {
            clients[i].send(message);
        }
    });

    //send immediately a feedback to the incoming connection
    ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(3000, () => {
    console.log(`Server started on port 3000`);
});
