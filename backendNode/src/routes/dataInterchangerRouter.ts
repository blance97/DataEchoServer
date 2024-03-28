import {Router} from 'express';
import convertToJSONFomart from "../services/convertToJSONFomart";
import convertToSQLFormat from "../services/convertToSQLFormat";
import ResponseModel from "../models/responseModel";
import groupRepository from "../repositories/groupRepository";
import logger from "../loggers";
import InvalidDataError from '../errors/InvalidDataError';
const router = Router();


router.get(`/exportJson`, async (req, res) => {
    try {
        const result = await convertToJSONFomart.exportToJson();
        logger.info('Data exported successfully');
        return res.status(200).json(result);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({error: 'Failed to export the data to JSON format', message: ""});
    }
});

router.post(`/importJson`, async (req, res) => {
    logger.info('Importing data to SQL database')
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({error: 'Invalid request', message: "Please provide the data in JSON format to import to SQL database"});
    }
    try {
        logger.info('Deleting all groups');
       await groupRepository.deleteAllGroups();
    } catch (error) {
        logger.error("Failed to delete all groups", error);
        return res.status(500).json(new ResponseModel('error', 'Failed to delete all groups', null, error));
    }
    logger.info('All groups deleted successfully');
    try {
        await convertToSQLFormat.insertData(req.body);
        logger.info('Data imported successfully');
        return res.status(200).json(new ResponseModel('success', 'Data imported successfully'));
    } catch (error) {
        logger.error(error);
        if(error instanceof InvalidDataError) {
            return res.status(400).json(new ResponseModel('error', 'Invalid data provided' + error, null, error));
        }
        return res.status(500).json(new ResponseModel('error', 'Failed to import the data to SQL database', null, error));
    }
});

export default router;