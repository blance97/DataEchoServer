// index.ts
import express, {Application} from 'express';
import bodyParser from 'body-parser';
import groupRouter from './routes/groupRouter';
import initializeDatabase from '../scripts/createTables';
import apiDetailsRouter from "./routes/apiDetailsRouter";
import dataInterchangerRouter from "./routes/dataInterchangerRouter";
import echoRouter from "./routes/echoRouter";
import logger from "./loggers";

const app: Application = express()
const port = 3000;

initializeDatabase();

app.use(bodyParser.json());

app.use('/api/des', groupRouter);
app.use('/api/des', apiDetailsRouter);
app.use('/api/des', dataInterchangerRouter);
app.use('*', echoRouter);

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`); // Use the logger instead of console.log
});