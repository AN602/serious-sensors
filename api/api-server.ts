import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let clients: WebSocket[] = [];

wss.on('connection', (ws: WebSocket) => {

    clients.push(ws);

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        for (var i = 0; i < clients.length; i++) {
            clients[i].send(message);
        }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(3000, () => {
    console.log(`Server started on port 3000`);
});