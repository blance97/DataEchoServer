import React, { useState, useEffect } from "react";
import {
    AccordionButton, AccordionIcon, AccordionItem,
    AccordionPanel,
    Box,
    Button, Flex,
    FormLabel, IconButton,
    Input,
    Select,
    Table,
    Tbody,
    Td, Text,
    Textarea,
    Th,
    Thead,
    Tr,
    VStack
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import ApiDetailModel from "../../shared/models/apiDetailModel";
import SupportedHTTPResponseBodyFormats from "../../shared/SupportedHTTPResponseBodyFormats.json";
import { validateResponseBody } from "../../shared/validateResponseBody";

interface ApiDetailCardProps {
    apiDetail: ApiDetailModel;
    updateApi: (apiDetail: ApiDetailModel) => void;
    deleteApi: (apiDetailId: number) => void;
}

const ApiDetailCard: React.FC<ApiDetailCardProps> = ({ apiDetail, updateApi, deleteApi }) => {
    const [httpMethod, setHttpMethod] = useState(apiDetail.apiMethod);
    const [originalHttpMethod, setOriginalHttpMethod] = useState(apiDetail.apiMethod);

    const [responseCode, setResponseCode] = useState(apiDetail.apiResponseCode);
    const [originalResponseCode, setOriginalResponseCode] = useState(apiDetail.apiResponseCode);

    const [responseBodyType, setResponseBodyType] = useState(apiDetail.apiResponseBodyType);
    const [originalResponseBodyType, setOriginalResponseBodyType] = useState(apiDetail.apiResponseBodyType);

    const [responseBody, setResponseBody] = useState(apiDetail.apiResponseBody);
    const [originalResponseBody, setOriginalResponseBody] = useState(apiDetail.apiResponseBody);

    const [responseHeaders, setResponseHeaders] = useState(apiDetail.apiResponseHeaders || []);

    const [apiName, setApiName] = useState(apiDetail.apiName);
    const [originalApiName, setOriginalApiName] = useState(apiDetail.apiName);

    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        setHttpMethod(apiDetail.apiMethod);
        setOriginalHttpMethod(apiDetail.apiMethod);

        setResponseCode(apiDetail.apiResponseCode);
        setOriginalResponseCode(apiDetail.apiResponseCode);

        setResponseBodyType(apiDetail.apiResponseBodyType);
        setOriginalResponseBodyType(apiDetail.apiResponseBodyType);

        setResponseBody(apiDetail.apiResponseBody);
        setOriginalResponseBody(apiDetail.apiResponseBody);

        setApiName(apiDetail.apiName);
        setOriginalApiName(apiDetail.apiName);

    }, [apiDetail]);

    const handleAddHeader = () => {
        setResponseHeaders([...responseHeaders, { headerName: '', headerValue: '' }]);
    };

    const handleEditHeader = (index: number, key: string, value: string) => {
        const newHeaders = [...responseHeaders];
        newHeaders[index] = { headerName: key, headerValue: value };
        setResponseHeaders(newHeaders);
    };

    const handleRemoveHeader = (index: number) => {
        const newHeaders = [...responseHeaders];
        newHeaders.splice(index, 1);
        setResponseHeaders(newHeaders);
    };

    const validateHeaders = () => {
        for (const header of responseHeaders) {
            if (!header.headerName.trim() || !header.headerValue.trim()) {
                setValidationError("Headers cannot be empty.");
                return false;
            }
        }
        setValidationError(null);
        return true;
    };

    const onSave = () => {
        setValidationError(null); // Clear previous errors

        if (!validateResponseBody(responseBody, responseBodyType)) {
            setValidationError('Invalid API Response Body format');
            return;
        }

        if (validateHeaders()) {
            updateApi({
                ...apiDetail,
                apiName: apiName,
                apiMethod: httpMethod,
                apiResponseBodyType: responseBodyType,
                apiResponseCode: responseCode,
                apiResponseBody: responseBody,
                apiResponseHeaders: responseHeaders
            });
        }
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete this API?')) {
            if (apiDetail.id !== undefined) {
                deleteApi(apiDetail.id);
            }
        }
    };

    const getColor = (method: string) => {
        switch (method) {
            case 'GET':
                return 'green.500';
            case 'POST':
                return 'blue.500';
            case 'PUT':
                return 'yellow.500';
            case 'DELETE':
                return 'red.500';
            default:
                return 'gray.500';
        }
    };

    return (
        <AccordionItem border="none">
            <AccordionButton>
                <Box flex="1" textAlign="left">
                    <Text as="span" color={getColor(apiDetail.apiMethod)} fontWeight="bold">{apiDetail.apiMethod}</Text>
                    {' '}
                    <Text as="span">{apiDetail.apiName}</Text>
                </Box>
                <IconButton
                    as='div'
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    variant="ghost"
                    colorScheme="red"
                    onClick={(event) => handleDelete(event)}
                />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
                <VStack align="start" spacing={2}>
                    <Box borderWidth="1px" bg="gray.50" borderRadius="md" p={4} my={2} boxShadow="base" width="100%">
                        <FormLabel>API Name</FormLabel>
                        <Input mb={2} backgroundColor={apiName !== originalApiName ? '#F6E05E' : 'white'}
                               value={apiName.startsWith('/') ? apiName : '/' + apiName}
                               onChange={(e) => setApiName(e.target.value)} />

                        <FormLabel>HTTP Method</FormLabel>
                        <Select value={httpMethod}
                                backgroundColor={httpMethod !== originalHttpMethod ? '#F6E05E' : 'white'}
                                onChange={(e) => {
                                    setHttpMethod(e.target.value)
                                }}>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </Select>
                        <FormLabel mt={4}>Response Code</FormLabel>
                        <Input value={responseCode}
                               backgroundColor={responseCode !== originalResponseCode ? '#F6E05E' : 'white'}
                               onChange={(e) => setResponseCode(Number(e.target.value))} type="text"
                               pattern="\d*" maxLength={5} />
                    </Box>
                    <Box borderWidth="1px" bg="gray.50" borderRadius="md" p={4} my={2} boxShadow="base" width="100%">
                        <FormLabel>Response Format</FormLabel>
                        <Select
                            backgroundColor={responseBodyType !== originalResponseBodyType ? '#F6E05E' : 'white'}
                            value={responseBodyType} onChange={(e) => setResponseBodyType(e.target.value)}>
                            {SupportedHTTPResponseBodyFormats.map(format => (
                                <option key={format} value={format}>{format}</option>
                            ))}
                        </Select>
                        <FormLabel mt={4}>Response Body</FormLabel>
                        <Textarea placeholder="Response Body"
                                  value={responseBody}
                                  backgroundColor={responseBody !== originalResponseBody ? '#F6E05E' : 'white'}
                                  onChange={(e) => {
                                      setResponseBody(e.target.value);
                                      setValidationError(null);
                                  }} height="150px"
                                  width="100%" />
                        {validationError && <Text color="red.500">{validationError}</Text>}
                    </Box>
                    <Box borderWidth="1px" bg="gray.50" borderRadius="md" p={4} my={2} boxShadow="base" width="100%">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Key</Th>
                                    <Th>Value</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {responseHeaders.map((header, index) => (
                                    <Tr key={index}>
                                        <Td><Input value={header.headerName}
                                                   onChange={(e) => handleEditHeader(index, e.target.value, header.headerValue)}/></Td>
                                        <Td><Input value={header.headerValue}
                                                   onChange={(e) => handleEditHeader(index, header.headerName, e.target.value)}/></Td>
                                        <Td><Button colorScheme="red"
                                                    onClick={() => handleRemoveHeader(index)}>Remove</Button></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        <Button colorScheme="blue" onClick={handleAddHeader}>Add Header</Button>
                    </Box>
                </VStack>
                <Flex justifyContent="flex-end">
                    <Button mr="2" onClick={onSave} colorScheme="blue" isDisabled={!!validationError}>Save</Button>
                    <Button colorScheme="red">Delete</Button>
                </Flex>
            </AccordionPanel>
        </AccordionItem>
    );
}

export default ApiDetailCard;