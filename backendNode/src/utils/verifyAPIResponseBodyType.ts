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
                parsedBody = JSON.parse(responseBody);
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
                console.log(responseBody);
                Papa.parse(responseBody, {
                    header: true,
                    complete: (result) => parsedBody = result.data,
                    error: (error) => {
                        console.error(`Failed to parse CSV: ${error}`);
                        parsedBody = responseBody;
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

    return JSON.stringify(parsedBody);
}