// middleware.ts
import { Request, Response, NextFunction } from 'express';
import {parse} from "url";

// Extend the Request interface to include the custom property
export interface CustomRequest extends Request {
    routeInfo?: {
        path: string;
        method: string;
        query: Record<any,any>;
        params: Record<string, string>;
    };
}

// Middleware to capture route information
export const captureRouteInfo = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    req.routeInfo = {
        path: parse(req.originalUrl, true).pathname as string,
        method: req.method,
        query: req.query,
        params: req.params,
    };
    next();
};
