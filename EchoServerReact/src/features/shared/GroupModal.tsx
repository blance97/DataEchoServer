import { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input } from '@chakra-ui/react';
import {GroupModel} from "./models/groupModel";

const GroupModal = ({ isOpen, onClose, onSave, title, group }: { isOpen: boolean, onClose: () => void, onSave: (group: GroupModel) => void, title: string, group: GroupModel | null }) => {
    const [groupName, setGroupName] = useState(group ? group.name : '');
    const [description, setDescription] = useState(group ? group.description : '');
    const handleSave = () => {
        onSave({
            id: group ? group.id : undefined,
            name: groupName,
            description: description,
            apiDetails: []
        });
        setGroupName('');
        setDescription('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Group Name</FormLabel>
                        <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSave}>Save</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GroupModal;