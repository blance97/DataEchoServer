import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text, ModalFooter
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {GroupModel} from "./models/groupModel";
import ApiDetailModel from "./models/apiDetailModel";
import HeaderModel from "./models/HeaderModel";


const AddApiModal = ({isOpen, onClose, onAdd, groups, error, apiStatus}: {
    isOpen: boolean,
    onClose: () => void,
    onAdd: (apiDetails: ApiDetailModel) => void,
    groups: GroupModel[],
    error: string,
    apiStatus: string
}) => {
    const [apiMethod, setApiMethod] = useState('GET');
    const [apiName, setApiName] = useState('');
    const [apiResponse, setApiResponse] = useState('');
    const [apiResponseCode, setApiResponseCode] = useState(200);
    const [headers, setHeaders] = useState<HeaderModel[]>([{headerName: '', headerValue: ''}]);
    const [selectedGroup, setSelectedGroup] = useState(-1);
    const [apiNameError, setApiNameError] = useState('');
    const [apiResponseError, setApiResponseError] = useState('');
    const [apiResponseCodeError, setApiResponseCodeError] = useState('');
    const [groupError, setGroupError] = useState('');

    useEffect(() => {
        if (apiStatus === 'idle' && !error) {
            // Clear the form fields
            setApiMethod('GET');
            setApiName('');
            setApiResponse('');
            setApiResponseCode(200);
            setHeaders([{headerName: '', headerValue: ''}]);
            // @ts-ignore
            setSelectedGroup(groups.length > 0 ? groups[0].id : -1);
            setApiNameError('');
            setApiResponseError('');
            setApiResponseCodeError('');
            setGroupError('');
        }
        if (groups.length > 0) {
            // @ts-ignore
            setSelectedGroup(groups[0].id);
        }
    }, [apiStatus, error, groups]);
    const handleAddHeader = () => {
        setHeaders([...headers, {headerName: '', headerValue: ''}]);
    };

    const handleRemoveHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const handleEditHeader = (index: number, headerName: string, headerValue: string) => {
        const newHeaders = [...headers];
        newHeaders[index] = {headerName, headerValue};
        setHeaders(newHeaders);
    };
    const handleAddApi = () => {
        let isValid = true;
        if (!selectedGroup || selectedGroup === -1) {
            setGroupError('Please add a group first');
            isValid = false;
        }

        if (!apiName) {
            setApiNameError('API Name is required');
            isValid = false;
        } else {
            setApiNameError('');
        }

        if (!apiResponse) {
            setApiResponseError('API Response is required');
            isValid = false;
        } else {
            setApiResponseError('');
        }

        if (!apiResponseCode) {
            setApiResponseCodeError('API Response Code is required');
            isValid = false;
        } else {
            setApiResponseCodeError('');
        }

        if (isValid) {
            const apiDetails: ApiDetailModel = {
                apiMethod: apiMethod,
                apiName: apiName,
                apiResponseBody: apiResponse,
                apiResponseCode: apiResponseCode,
                groupId: selectedGroup,
                apiResponseHeaders: headers
            };
            onAdd(apiDetails);
        }
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent maxW="60vW">
                <ModalHeader>Add API</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Group</FormLabel>
                        <Select value={selectedGroup}
                                onChange={(e) => {
                                    const selected = groups.find(group => group.id === Number(e.target.value));
                                    if (selected) {
                                        // @ts-ignore
                                        setSelectedGroup(selected.id); // Only call setSelectedGroup if a group was found
                                    }
                                }}>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </Select>
                        {groupError && <Text color="red.500">{groupError}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel>API Method</FormLabel>
                        <Select value={apiMethod} onChange={(e) => setApiMethod(e.target.value)}>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </Select>
                    </FormControl>
                    <FormControl mt={2}>
                        <FormLabel>API Name</FormLabel>
                        <Input value={apiName} onChange={(e) => setApiName(e.target.value)}/>
                        {apiNameError && <Text color="red.500">{apiNameError}</Text>}
                    </FormControl>
                    <FormControl mt={2}>
                        <FormLabel>API Response</FormLabel>
                        <Input value={apiResponse} onChange={(e) => setApiResponse(e.target.value)}/>
                        {apiResponseError && <Text color="red.500">{apiResponseError}</Text>}
                    </FormControl>
                    <FormControl mt={2}>
                        <FormLabel>API Response Code</FormLabel>
                        <Input value={apiResponseCode} onChange={(e) => setApiResponseCode(Number(e.target.value))}
                               type="number"/>
                        {apiResponseCodeError && <Text color="red.500">{apiResponseCodeError}</Text>}
                    </FormControl>
                    <FormControl maxH="200px" overflowY="auto" mt={2}>
                        <FormLabel>Headers</FormLabel>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Key</Th>
                                    <Th>Value</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {headers.map((header, index) => (
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
                    </FormControl>
                    <Button colorScheme="blue" onClick={handleAddHeader} mt={2}>Add Header</Button>

                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleAddApi}>Save</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddApiModal;