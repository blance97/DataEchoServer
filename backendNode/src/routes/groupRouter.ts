import * as groupController from '../controllers/groupsController';
import { Router } from 'express';
const router = Router();

const rootPath = '/groups';
// Get all groups
router.get(`${rootPath}/`, groupController.getAllGroups);
router.post(`${rootPath}/`, groupController.addGroup);
router.delete(`${rootPath}/:id`, groupController.deleteGroup);
router.put(`${rootPath}/:name`, groupController.updateGroup);
export default router;