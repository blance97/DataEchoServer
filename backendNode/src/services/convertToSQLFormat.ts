import knex from "knex";
import config from "../../config/knexfile";

const db = knex(config.development);

const insertData = async(jsonData: any) => {
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
                        group_id: groupId,
                        api_name: apiDetail.api_name,
                        api_method: apiDetail.api_method,
                        api_response_body: apiDetail.api_response_body,
                        api_response_code: apiDetail.api_response_code,
                    });

                    // Insert response headers for each API detail
                    for (const responseHeader of apiDetail.responseHeaders) {
                        await trx('response_headers').insert({
                            api_id: apiDetailId,
                            header_name: responseHeader.header_name,
                            header_value: responseHeader.header_value,
                        });
                    }
                }
            }
        });

}

export default {insertData};
