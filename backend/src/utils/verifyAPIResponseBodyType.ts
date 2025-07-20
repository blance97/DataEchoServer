import supportedFormats from "../data/SupportedHTTPResponseBodyFormats.json";
import * as Papa from 'papaparse';
import yaml from 'js-yaml';
import msgpack5 from 'msgpack5';
import * as js2xmljs from 'xml-js';
import {ElementCompact} from "xml-js";
import logger from "../loggers";

export function getStringFromResponseBody(responseBody: any, format: string): string {
    logger.info(`Getting string from response body in format: ${format}`);
    if (!supportedFormats.includes(format)) {
        logger.error(`Unsupported format: ${format}`);
        throw new Error(`Unsupported format: ${format}`);
    }

    let parsedBody: any;

    try {
        switch (format) {
            case 'JSON':
                parsedBody = JSON.stringify(JSON.parse(responseBody));
                break;
            case 'XML':
                let res: Element | ElementCompact = js2xmljs.xml2js(responseBody);
                parsedBody = js2xmljs.js2xml(res);
                break;
            case 'HTML':
                parsedBody = responseBody;
                break;
            case 'Text':
                parsedBody = responseBody;
                break;
            case 'CSV':
                logger.info(`Parsing CSV`);
                Papa.parse(responseBody, {
                    header: true,
                    complete: (result) => {
                        logger.info(`Parsed CSV Successfully`);
                        parsedBody = responseBody;
                    },
                    error: (error) => {
                        throw new Error(`Failed to parse CSV: ${error}`);
                    }
                });
                break;
            case 'MessagePack':
                parsedBody = JSON.stringify(msgpack5().decode(responseBody));
                break;
            case 'YAML':
                logger.info(`Parsing YAML`);
                try {
                    parsedBody = yaml.dump(yaml.load(responseBody));
                } catch (error) {
                    throw new Error(`Failed to parse the response body as ${format}: ${error}`);
                }
                break;
        }
    } catch (error) {
        throw new Error(`Failed to parse the response body as ${format}: ${error}`);
    }

    logger.info(`Got string from response body in format: ${format}`);
    return parsedBody;
}

export function convertStringToFormat(input: string, format: string): any {
    let result: any;
    logger.info(`Converting string to format: ${format}`)
    switch (format) {
        case 'JSON':
            result = JSON.parse(input);
            break;
        case 'XML':
            let res: ElementCompact = js2xmljs.xml2js(input);
            result = js2xmljs.js2xml(res);
            break;
        case 'HTML':
            result = input;
            break;
        case 'Text':
            result = input;
            break;
        case 'CSV':
            logger.info(`Parsing CSV`);
            Papa.parse(input, {
                header: true,
                complete: (parsedResult) => {
                    logger.info(`Parsed CSV Successfully`);
                    result = input;
                },
                error: (error: any) => {
                    logger.error(`Failed to parse CSV: ${error}`);
                    throw new Error(`Failed to parse CSV: ${error}`);
                }
            });
            break;
        case 'MessagePack':
            result = msgpack5().decode(Buffer.from(input));
            break;
        case 'YAML':
            try{
                const parsedYAML = yaml.load(input);
                result = yaml.dump(parsedYAML, { indent: 2 });
                console.log(result);
            }
            catch(error){
                logger.error(`Failed to parse the response body as ${format}: ${error}`);
                throw new Error(`Failed to parse the response body as ${format}: ${error}`);
            }
            break;
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
    logger.info(`Converted string to format: ${format}`)
    return result;
}