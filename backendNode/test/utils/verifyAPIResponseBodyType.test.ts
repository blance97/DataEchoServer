import { getStringFromResponseBody } from '../../src/utils/verifyAPIResponseBodyType';

describe('getStringFromResponseBody', () => {
    it('returns stringified JSON when format is JSON', () => {
        const responseBody = '{"key":"value"}';
        const result = getStringFromResponseBody(responseBody, 'JSON');
        expect(result).toBe(responseBody);
    });

    it('throws error when format is unsupported', () => {
        const responseBody = '<key>value</key>';
        expect(() => getStringFromResponseBody(responseBody, 'UnsupportedFormat')).toThrowError('Unsupported format: UnsupportedFormat');
    });

    it('throws error when JSON parsing fails', () => {
        const responseBody = 'not a json string';
        expect(() => getStringFromResponseBody(responseBody, 'JSON')).toThrowError();
    });

    it('returns stringified XML when format is XML', () => {
        const responseBody = '<key>value</key>';
        const result = getStringFromResponseBody(responseBody, 'XML');
        expect(result).toBe(JSON.stringify(responseBody));
    });

    it('returns stringified MessagePack when format is MessagePack', () => {
        const msgpack = require('msgpack5')();
        const responseBody = msgpack.encode({ key: 'value' });
        const result = getStringFromResponseBody(responseBody, 'MessagePack');
        expect(result).toBe(JSON.stringify({ key: 'value' }));
    });

    it('returns stringified HTML when format is HTML', () => {
        const responseBody = '<div>Test</div>';
        const result = getStringFromResponseBody(responseBody, 'HTML');
        expect(result).toBe(JSON.stringify(responseBody));
    });

    it('returns stringified Text when format is Text', () => {
        const responseBody = 'Test text';
        const result = getStringFromResponseBody(responseBody, 'Text');
        expect(result).toBe(JSON.stringify(responseBody));
    });

    it('returns stringified CSV when format is CSV', () => {
        const responseBody = 'name,age\nAlice,20\nBob,25';
        const result = getStringFromResponseBody(responseBody, 'CSV');
        expect(result).toBe(JSON.stringify([{ name: 'Alice', age: '20' }, { name: 'Bob', age: '25' }]));
    });


    it('returns stringified YAML when format is YAML', () => {
        const responseBody = 'key: value';
        const result = getStringFromResponseBody(responseBody, 'YAML');
        expect(result).toBe(JSON.stringify({ key: 'value' }));
    });

    // Add more tests for other formats and edge cases
});