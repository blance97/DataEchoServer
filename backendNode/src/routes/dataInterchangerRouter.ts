    import {Router} from 'express';
import convertToJSONFomart from "../services/convertToJSONFomart";
import convertToSQLFormat from "../services/convertToSQLFormat";
import ResponseModel from "../models/responseModel";

const router = Router();


router.get(`/exportJson`, async (req, res) => {
    try {
        const result = await convertToJSONFomart.exportToJson();
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Failed to export the data to JSON format', message: ""});
    }
});

router.post(`/importJson`, async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({error: 'Invalid request', message: "Please provide the data in JSON format to import to SQL database"});
    }
    try {
        await convertToSQLFormat.insertData(req.body);
        return res.status(200).json(new ResponseModel('success', 'Data imported successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to import the data to SQL database', null, error));
    }
});

export default router;