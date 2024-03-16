import React, {useEffect, useState} from 'react';
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
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
    const dispatch = useDispatch();
    const groups: GroupModel[] = useSelector((state: RootState) => state.group.groups);

    const handleModalOpen = (group?: GroupModel) => {
        if (group) {
            setSelectedGroup(group);
            setIsGroupModalOpen(true);
        }
    }

    const handleModalClose = () => {
        setIsGroupModalOpen(false);
    }

    const handleModalSave = (group: GroupModel) => {
        // @ts-ignore
        dispatch(updateGroup(group));
        setIsGroupModalOpen(false);
    }

    return (
        <div>
            <h1>Groups</h1>
            <GroupModal isOpen={isGroupModalOpen} onClose={handleModalClose} onSave={handleModalSave} title="Edit Group"
                        group={selectedGroup}/>
            <Accordion defaultIndex={[0]} allowMultiple>
                {groups.map((group) => (
                    <AccordionItem key={group.id}>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                <b>{group.name}</b>
                            </Box>
                            <IconButton
                                as="div"
                                size="sm"
                                colorScheme="blue"
                                aria-label="Edit"
                                icon={<EditIcon/>}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleModalOpen(group);
                                }} mr={2}/>
                            <IconButton
                                as="div"
                                size="sm"
                                colorScheme="red"
                                aria-label="Exit"
                                icon={<CloseIcon/>}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (group.id) {
                                        dispatch(deleteGroup(group.id) as any);
                                    }
                                }}
                                mr={2}/>
                            <AccordionIcon/>
                        </AccordionButton>
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