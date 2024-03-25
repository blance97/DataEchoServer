import WebSocket from "ws";
import logger from "./loggers";

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        logger.info('received: %s', message);
    });
});

wss.on('listening', () => {
    logger.info('WebSocket server is listening');
});

wss.on('listening', () => {
    logger.info('WebSocket server is listening');
});

const sendMessages = (message: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export default {wss, sendMessages};
