// index.ts
import express, {Application, NextFunction, Request, Response} from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRouter';
import initializeDatabase from '../scripts/createTables';
import apiDetailsRouter from "./routes/apiDetailsRouter";
import dataInterchangerRouter from "./routes/dataInterchangerRouter";
import echoRouter from "./routes/echoRouter";
import logger from "./loggers";
import websocketServer from "./websocketServer";

const app: Application = express()
const port = 3000 || process.env.PORT

initializeDatabase();

app.use(bodyParser.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ('body' in err) {
        res.status(400).json({ message: 'Invalid JSON' }); // Bad request
        return;
    }

    next();
});

app.use('/api/des', groupRouter);
app.use('/api/des', apiDetailsRouter);
app.use('/api/des', dataInterchangerRouter);
app.use('*', echoRouter);

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`); // Use the logger instead of console.log
});

websocketServer.wss;