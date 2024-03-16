import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "../../../store";
import {GroupModel} from "../../shared/models/groupModel";
import GroupCard from "../components/GroupCard";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    IconButton
} from "@chakra-ui/react";
import {EditIcon, CloseIcon} from '@chakra-ui/icons';
import {deleteGroup, updateGroup} from "../GroupSlice";
import GroupModal from "../../shared/GroupModal";

const GroupContainer: React.FC = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState<GroupModel | null>(null);
    const dispatch = useDispatch();
    const groups: GroupModel[] = useSelector((state: RootState) => state.group.groups);

    const handleEditGroupModalOpen = () => {
        setIsGroupModalOpen(true);
    }
    const handleEditGroupModalClose = () => {
        setIsGroupModalOpen(false);
    }

    const handleEditGroupModalSave = (group: GroupModel) => {
        console.log(group)
        const updatedGroup: GroupModel = {
            id: group.id,
            name: group.name,
            description: group.description,
            apiDetails: []
        }
        // @ts-ignore
        dispatch(updateGroup(updatedGroup));
        setIsGroupModalOpen(false);
    }

    return (
        <div>
            <h1>Groups</h1>
            <GroupModal isOpen={isGroupModalOpen} onClose={handleEditGroupModalClose} onSave={handleEditGroupModalSave} title="Edit Group" group={selectedGroup}/>
            <Accordion defaultIndex={[0]} allowMultiple>
                {groups.map((group) => (
                    <AccordionItem key={group.id}>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <b>{group.name}</b>
                                </Box>
                                <IconButton size="sm" colorScheme="blue" aria-label="Edit" icon={<EditIcon/>}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedGroup(group);
                                                handleEditGroupModalOpen();
                                            }} mr={2}/>
                                <IconButton
                                    size="sm"
                                    colorScheme="red"
                                    aria-label="Exit"
                                    icon={<CloseIcon/>}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // @ts-ignore
                                        dispatch(deleteGroup(group.id));
                                    }}
                                    mr={2}/>
                                <AccordionIcon/>
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <GroupCard group={group}/>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default GroupContainer;