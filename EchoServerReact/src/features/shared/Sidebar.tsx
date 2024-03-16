import React from 'react';
import {Box, Text, Button, Flex} from '@chakra-ui/react';
import {useDispatch} from 'react-redux';
import {addGroupAsync} from "../Groups/GroupSlice";
import {GroupModel} from "./models/groupModel";
import {AppDispatch} from "../../store";
import GroupModal from "./GroupModal";

const Sidebar = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();


    const handleAddApiDetail = () => {
        // Define what should happen when the "Add API" button is clicked
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
                <Button colorScheme="blue" onClick={handleAddApiDetail}>Add API</Button>
            </Flex>
            <GroupModal isOpen={isGroupModalOpen} onClose={handleAddGroupModalClose} onSave={handleAddGroupModalSave}
                        title="Add Group"/>
        </Box>
    );
};

export default Sidebar;