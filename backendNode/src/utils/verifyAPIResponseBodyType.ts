import supportedFormats from "../data/SupportedHTTPResponseBodyFormats.json";
import * as Papa from 'papaparse';
import yaml from 'js-yaml';
import msgpack5 from 'msgpack5';
import * as js2xmljs from 'xml-js';
import {ElementCompact} from "xml-js";

export function getStringFromResponseBody(responseBody: any, format: string): string {
    // Check if the format is supported
    if (!supportedFormats.includes(format)) {
        throw new Error(`Unsupported format: ${format}`);
    }

    let parsedBody: any;

    // Try to parse the response body according to the format
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
                Papa.parse(responseBody, {
                    header: true,
                    complete: (result) => parsedBody = result.data,
                    error: (error) => {
                        throw new Error(`Failed to parse CSV: ${error}`);
                    }
                });
                break;
            case 'MessagePack':
                parsedBody = msgpack5().decode(responseBody);
                break;
            case 'YAML':
                parsedBody = yaml.load(responseBody);
                break;
        }
    } catch (error) {
        throw new Error(`Failed to parse the response body as ${format}: ${error}`);
    }

    return String(parsedBody);
}

export function convertStringToFormat(input: string, format: string): any {
    let result: any;

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
            Papa.parse(input, {
                header: true,
                complete: (parsedResult) => result = parsedResult.data,
                error: (error: any) => {
                    console.error(`Failed to parse CSV: ${error}`);
                    throw new Error(`Failed to parse CSV: ${error}`);
                }
            });
            break;
        case 'MessagePack':
            result = msgpack5().decode(Buffer.from(input));
            break;
        case 'YAML':
            result = yaml.load(input);
            break;
        default:
            throw new Error(`Unsupported format: ${format}`);
    }

    return result;
}