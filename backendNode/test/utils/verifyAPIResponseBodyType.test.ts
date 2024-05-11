import {convertStringToFormat, getStringFromResponseBody} from '../../src/utils/verifyAPIResponseBodyType';

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

});

describe('convertStringToFormat', () => {
    it('converts string to JSON when format is JSON', () => {
        const input = '{"key":"value"}';
        const result = convertStringToFormat(input, 'JSON');
        expect(result).toEqual({key: 'value'});
    });

    it('throws error when format is unsupported', () => {
        const input = '<key>value</key>';
        expect(() => convertStringToFormat(input, 'UnsupportedFormat')).toThrowError('Unsupported format: UnsupportedFormat');
    });

    it('converts string to XML when format is XML', () => {
        const input = '<key>value</key>';
        const result = convertStringToFormat(input, 'XML');
        expect(result).toBe(input);
    });

    it('converts string to HTML when format is HTML', () => {
        const input = '<div>Test</div>';
        const result = convertStringToFormat(input, 'HTML');
        expect(result).toBe(input);
    });

    it('converts string to Text when format is Text', () => {
        const input = 'Test text';
        const result = convertStringToFormat(input, 'Text');
        expect(result).toBe(input);
    });

    it('converts string to CSV when format is CSV', () => {
        const input = 'name,age\nAlice,20\nBob,25';
        const result = convertStringToFormat(input, 'CSV');
        expect(result).toEqual([{name: 'Alice', age: '20'}, {name: 'Bob', age: '25'}]);
    });

    it('converts string to MessagePack when format is MessagePack', () => {
        const msgpack = require('msgpack5')();
        const input = msgpack.encode({key: 'value'});
        const result = convertStringToFormat(input, 'MessagePack');
        expect(result).toEqual({key: 'value'});
    });

    it('converts string to YAML when format is YAML', () => {
        const input = 'key: value';
        const result = convertStringToFormat(input, 'YAML');
        expect(result).toEqual({key: 'value'});
    });
});