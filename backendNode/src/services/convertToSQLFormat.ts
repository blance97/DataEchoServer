import Joi from 'joi';
import knex from "knex";
import config from "../../config/knexfile";
import logger from "../loggers";
import InvalidDataError from "../errors/InvalidDataError";

const db = knex(config.development);

const groupSchema = Joi.object({
    groups: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            apiDetails: Joi.array().items(
                Joi.object({
                    apiName: Joi.string().required(),
                    apiMethod: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE').required(),
                    apiResponseBody: Joi.string().required(),
                    apiResponseCode: Joi.number().required(),
                    responseHeaders: Joi.array().items(
                        Joi.object({
                            headerName: Joi.string().required(),
                            headerValue: Joi.string().required(),
                        })
                    ).required(),
                })
            ).required(),
        })
    ).required(),
});

const insertData = async(jsonData: any) => {
    const { error } = groupSchema.validate(jsonData);
    if (error) {
        logger.error(`Invalid data: ${error.details[0].message}`);
        throw new InvalidDataError(`Invalid data: ${error.details[0].message}`);
    }

    return await db.transaction(async (trx) => {
        // Insert groups
        for (const group of jsonData.groups) {
            const [groupId] = await trx('groups').insert({
                name: group.name,
                description: group.description,
            });
            // Insert API details for each group
            for (const apiDetail of group.apiDetails) {
                const [apiDetailId] = await trx('api_details').insert({
                    groupId: groupId,
                    apiName: apiDetail.apiName,
                    apiMethod: apiDetail.apiMethod,
                    apiResponseBody: apiDetail.apiResponseBody,
                    apiResponseCode: apiDetail.apiResponseCode,
                });

                // Insert response headers for each API detail
                for (const responseHeader of apiDetail.responseHeaders) {
                    await trx('response_headers').insert({
                        apiId: apiDetailId,
                        headerName: responseHeader.headerName,
                        headerValue: responseHeader.headerValue,
                    });
                }
            }
        }
    });
}

export default {insertData};