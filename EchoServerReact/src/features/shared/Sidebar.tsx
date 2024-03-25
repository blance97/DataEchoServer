import React, {useEffect} from 'react';
import {Box, Text, Button, Flex} from '@chakra-ui/react';
import {useDispatch, useSelector} from 'react-redux';
import {addGroupAsync} from "../Groups/GroupSlice";
import {GroupModel} from "./models/groupModel";
import {AppDispatch} from "../../store";
import GroupModal from "./GroupModal";
import AddApiModal from "./AddApiModal";
import ApiDetailModel from "./models/apiDetailModel";
import {addApiDetailAsync} from "../apiDetails/apiDetailsSlice";
import LoggingContainer from "../console/LoggingContainer";

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


    return (
        <Box bg="gray.200" p="4" h="100vh" w="250px" position="fixed" left="0" top="0">
            <Text fontWeight="bold" mb="4">Menu</Text>
            <Flex direction="column">
                <Button colorScheme="blue" mb="2" onClick={handleAddGroupModalOpen}>Add Group</Button>
                <Button colorScheme="blue" onClick={handleOpenApiModal}>Add API</Button>
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