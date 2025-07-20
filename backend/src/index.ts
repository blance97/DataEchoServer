import express, { Application, Request, Response } from 'express';
import path from 'path';
import groupRouter from './routes/groupRouter';
import initializeDatabase from '../scripts/createTables';
import apiDetailsRouter from './routes/apiDetailsRouter';
import dataInterchangerRouter from './routes/dataInterchangerRouter';
import echoRouter from './routes/echoRouter';
import logger from './loggers';
import { appPort } from '../config/config.json';

const app: Application = express();
const port = appPort || process.env.PORT;

// Initialize the database
initializeDatabase()
    .then(() => logger.info('Database initialized'))
    .catch(e => logger.error('Error initializing database', e));

// Middleware for JSON parsing
app.use(express.json());

// Read BUILD_PATH and ASSETS_PATH from environment variables, with fallbacks
const buildPath = process.env.BUILD_PATH ? path.resolve(process.env.BUILD_PATH) : path.join(__dirname, '../../../build');
const assetsPath = process.env.ASSETS_PATH ? path.resolve(process.env.ASSETS_PATH) : path.join(__dirname, '../../../assets');

app.use(express.static(buildPath));
app.use(express.static(assetsPath));

// API routes
app.use('/api/des', groupRouter);
app.use('/api/des', apiDetailsRouter);
app.use('/api/des', dataInterchangerRouter);

// Serve the UI for the root route
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Fallback for unmatched requests
app.use('*', echoRouter);

// Start the server
app.listen(port, () => logger.info(`Server running at http://localhost:${port}`));