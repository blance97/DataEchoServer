import yaml from 'js-yaml';

export const validateResponseBody = (body: string, type: string): boolean => {
    try {
        switch (type) {
            case 'JSON':
                JSON.parse(body);
                break;
            case 'XML':
                new DOMParser().parseFromString(body, 'application/xml');
                break;
            case 'HTML':
                new DOMParser().parseFromString(body, 'text/html');
                break;
            case 'Text':
                // No specific validation needed for plain text
                break;
            case 'CSV':
                // Simple CSV validation: check if it contains commas and newlines
                if (!body.includes(',') || !body.includes('\n')) {
                    throw new Error('Invalid CSV format');
                }
                break;
            case 'YAML':
                yaml.load(body);
                break;
            default:
                throw new Error('Unsupported format');
        }
        return true;
    } catch (error) {
        return false;
    }
};