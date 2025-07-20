import { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalCloseButton
} from '@chakra-ui/react';
import { GroupModel } from "./models/groupModel";

const GroupModal = ({ isOpen, onClose, onSave, title, group }: { isOpen: boolean, onClose: () => void, onSave: (group: GroupModel) => void, title: string, group: GroupModel | null }) => {
    const [groupDetails, setGroupDetails] = useState({ name: '', description: '' });

    useEffect(() => {
        if (group) {
            setGroupDetails({ name: group.name, description: group.description });
        }
    }, [group]);

    const handleSave = () => {
        onSave({
            id: group ? group.id : undefined,
            name: groupDetails.name,
            description: groupDetails.description,
            apiDetails: []
        });
        setGroupDetails({ name: '', description: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'name' | 'description') => {
        setGroupDetails(prevState => ({ ...prevState, [key]: e.target.value }));
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
                        <Input value={groupDetails.name} onChange={(e) => handleChange(e, 'name')} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input value={groupDetails.description} onChange={(e) => handleChange(e, 'description')} />
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