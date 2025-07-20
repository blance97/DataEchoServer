import {Router, Request, Response, NextFunction} from "express";
import echoController from "../controllers/echoController";
import {captureRouteInfo} from "../middleware";



const router = Router();

router.use(captureRouteInfo);

router.all('*', echoController.validatePath);

export default router;