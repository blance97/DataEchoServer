import React, {useEffect} from 'react';
import {Box, Text, Button, Flex, Input} from '@chakra-ui/react';
import {useDispatch, useSelector} from 'react-redux';
import {addGroupAsync, fetchAllGroups} from "../Groups/GroupSlice";
import {GroupModel} from "./models/groupModel";
import {AppDispatch} from "../../store";
import GroupModal from "./GroupModal";
import AddApiModal from "./AddApiModal";
import ApiDetailModel from "./models/apiDetailModel";
import {addApiDetailAsync, fetchAllApiDetails} from "../apiDetails/apiDetailsSlice";
import LoggingContainer from "../console/LoggingContainer";
import {DownloadIcon, PlusSquareIcon} from "@chakra-ui/icons";
import {toast} from "react-toastify";

const Sidebar = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);
    const [isApiModalOpen, setIsApiModalOpen] = React.useState(false);
    const groups = useSelector((state: any) => state.group.groups);
    const apiDetails = useSelector((state: any) => state.apiDetails);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (apiDetails.status === 'idle' && isApiModalOpen && !apiDetails.error) {
            setIsApiModalOpen(false);
        }
    }, [apiDetails.status]);
    const handleOpenApiModal = () => {
        setIsApiModalOpen(true);
    }

    const handleCloseApiModal = () => {
        setIsApiModalOpen(false);
    }
    const handleAddApiDetail = (api: ApiDetailModel) => {
        dispatch(addApiDetailAsync(api));
    };

    const handleAddGroupModalOpen = () => {
        setIsGroupModalOpen(true);
    }
    const handleAddGroupModalClose = () => {
        setIsGroupModalOpen(false);
    }
    const handleAddGroupModalSave = (group: GroupModel) => {
        const groupToAdd: GroupModel = {
            name: group.name,
            description: group.description,
            apiDetails: []
        };
        dispatch(addGroupAsync(groupToAdd));
        setIsGroupModalOpen(false);
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target ? e.target.result as string : null;
                if (content) {
                    try {
                        const data = JSON.parse(content);
                        const response = await fetch('/api/des/importJson', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                        if (!response.ok) {
                            const responseBody = await response.json();
                            toast.error(`Client error occurred: ${responseBody.message}`);
                            return;
                        }
                        alert('Data imported successfully');
                        // @ts-ignore
                        dispatch(fetchAllGroups());
                        // @ts-ignore
                        dispatch(fetchAllApiDetails());
                    } catch (error) {
                        toast.error(`Server error occurred: ${error.toString()}`);
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch('/api/des/exportJson');
            if (!response.ok) {
                const responseBody = await response.json();
                toast.error(`Client error occurred: ${responseBody.message}`);
                return;
            }
            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'export.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
        }
    };

    return (<Box bg="gray.200" p="4" h="100vh" w="250px" position="fixed" left="0" top="0">
        <Text fontWeight="bold" mb="4">Menu</Text>
        <Flex direction="column">
            <Button colorScheme="blue" mb="2" onClick={handleAddGroupModalOpen}>Add Group</Button>
            <Button colorScheme="blue" onClick={handleOpenApiModal}>Add API</Button>

            <Box border="1px" borderColor="gray.300" borderRadius="md" p="2" mt="2">
                <Flex direction="column">

                    <Input type="file" accept=".json" onChange={handleImport} style={{display: 'none'}}
                           id="import-input"/>
                    <label htmlFor="import-input">
                        <Button w="100%" mb="2" leftIcon={<PlusSquareIcon/>} colorScheme="teal" mt="2" as="span">Import</Button>
                    </label>
                    <Button leftIcon={<DownloadIcon/>} colorScheme="teal" onClick={handleExport}>Export</Button>
                </Flex>
            </Box>
        </Flex>
            <GroupModal isOpen={isGroupModalOpen} onClose={handleAddGroupModalClose} onSave={handleAddGroupModalSave}
                    title="Add Group" group={null}/>
        <AddApiModal isOpen={isApiModalOpen} onClose={handleCloseApiModal} onAdd={handleAddApiDetail}
                     groups={groups} apiStatus={apiDetails.status} error={apiDetails.error}/>
        <LoggingContainer/>
    </Box>
    );
};

export default Sidebar;