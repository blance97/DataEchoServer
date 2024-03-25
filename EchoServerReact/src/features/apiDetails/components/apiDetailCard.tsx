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
import React, {useEffect, useState} from "react";
import ApiDetailModel from "../../shared/models/apiDetailModel";
import {DeleteIcon} from "@chakra-ui/icons";

interface ApiDetailCardProps {
    apiDetail: ApiDetailModel;
    updateApi: (apiDetail: ApiDetailModel) => void;
    deleteApi: (apiDetailId: number) => void;
}

const ApiDetailCard: React.FC<ApiDetailCardProps> = ({apiDetail, updateApi, deleteApi}) => {
    const [httpMethod, setHttpMethod] = useState(apiDetail.apiMethod);
    const [originalHttpMethod, setOriginalHttpMethod] = useState(apiDetail.apiMethod);

    const [responseCode, setResponseCode] = useState(apiDetail.apiResponseCode);
    const [originalResponseCode, setOriginalResponseCode] = useState(apiDetail.apiResponseCode);

    const [responseFormat, setResponseFormat] = useState('JSON');

    const [responseBody, setResponseBody] = useState(apiDetail.apiResponseBody);
    const [originalResponseBody, setOriginalResponseBody] = useState(apiDetail.apiResponseBody);

    const [responseHeaders, setResponseHeaders] = useState(apiDetail.apiResponseHeaders || []);

    const [apiName, setApiName] = useState(apiDetail.apiName);
    const [originalApiName, setOriginalApiName] = useState(apiDetail.apiName);

    useEffect(() => {
        setHttpMethod(apiDetail.apiMethod);
        setOriginalHttpMethod(apiDetail.apiMethod);

        setResponseCode(apiDetail.apiResponseCode);
        setOriginalResponseCode(apiDetail.apiResponseCode);

        setResponseBody(apiDetail.apiResponseBody);
        setOriginalResponseBody(apiDetail.apiResponseBody);

        setApiName(apiDetail.apiName);
        setOriginalApiName(apiDetail.apiName);

    }, [apiDetail]);


    const handleAddHeader = () => {
        setResponseHeaders([...responseHeaders, {headerName: '', headerValue: ''}]);
    };

    const handleEditHeader = (index: number, key: string, value: string) => {
        const newHeaders = [...responseHeaders];
        newHeaders[index] = {headerName: key, headerValue: value};
        setResponseHeaders(newHeaders);
    };

    const handleRemoveHeader = (index: number) => {
        const newHeaders = [...responseHeaders];
        newHeaders.splice(index, 1);
        setResponseHeaders(newHeaders);
    };

    const onSave = () => {
        updateApi({
            ...apiDetail,
            apiName: apiName,
            apiMethod: httpMethod,
            apiResponseCode: responseCode,
            apiResponseBody: responseBody,
            apiResponseHeaders: responseHeaders
        });
    }

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete this API?')) {
            if (apiDetail.id !== undefined) {
                deleteApi(apiDetail.id);
            }
        }
    }

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
                    <Text as="span" color={getColor(apiDetail.apiMethod)}
                          fontWeight="bold">{apiDetail.apiMethod}</Text>
                    {' '}
                    <Text as="span">{apiDetail.apiName}</Text>
                </Box>
                <IconButton
                    as='div'
                    aria-label="Delete"
                    icon={<DeleteIcon/>}
                    variant="ghost"
                    colorScheme="red"
                    onClick={(event) => handleDelete(event)} // Add your delete handler here
                />
                <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
                <VStack align="start" spacing={2}>
                    <Box borderWidth="1px" bg="gray.50" borderRadius="md" p={4} my={2} boxShadow="base" width="100%">
                        <FormLabel>API Name</FormLabel>
                        <Input mb={2} backgroundColor={apiName !== originalApiName ? '#F6E05E' : 'white'}
                               value={apiName} onChange={(e) => setApiName(e.target.value)}/>

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
                               pattern="\d*" maxLength={5}/>
                    </Box>
                    <Box borderWidth="1px" bg="gray.50" borderRadius="md" p={4} my={2} boxShadow="base" width="100%">
                        <FormLabel>Response Format</FormLabel>
                        <Select placeholder="Select response format" value={responseFormat}
                                onChange={(e) => setResponseFormat(e.target.value)}>
                            <option value="JSON">JSON</option>
                            <option value="String">String</option>
                        </Select>
                        <FormLabel mt={4}>Response Body</FormLabel>
                        <Textarea placeholder="Response Body"
                                  value={responseBody}
                                  backgroundColor={responseBody !== originalResponseBody ? '#F6E05E' : 'white'}
                                  onChange={(e) => setResponseBody(e.target.value)} height="150px"
                                  width="100%"/>
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
                    <Button mr="2" onClick={onSave} colorScheme="blue">Save</Button>
                    <Button colorScheme="red">Delete</Button>
                </Flex>
            </AccordionPanel>
        </AccordionItem>
    );
}
export default ApiDetailCard;