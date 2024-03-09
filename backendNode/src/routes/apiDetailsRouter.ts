import { Router } from 'express';
const router = Router();
import * as apiDetailsController from '../controllers/apiDetailsController';

const rootPath = "/apiDetails";
router.post(`${rootPath}/`, apiDetailsController.addApiDetails);
router.get(`${rootPath}/getAll`, apiDetailsController.getAllApiDetails);
router.get(`${rootPath}/`, apiDetailsController.getApiDetailsfromId);
router.put(`${rootPath}/`, apiDetailsController.updateApiDetails);
router.delete(`${rootPath}/:id`, apiDetailsController.deleteApiDetails);
router.post(`${rootPath}/addHeaders`, apiDetailsController.addResponseHeaders);
router.get(`${rootPath}/getHeaders/:apiId`, apiDetailsController.getResponseHeaders);
router.delete(`${rootPath}/deleteHeader/:headerId`, apiDetailsController.deleteResponseHeaders);
export default router;