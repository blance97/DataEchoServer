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
    Box, Flex,
    IconButton, Input, Spacer,
    Text
} from "@chakra-ui/react";
import {EditIcon, CloseIcon} from '@chakra-ui/icons';
import {deleteGroup, updateGroup} from "../GroupSlice";
import GroupModal from "../../shared/GroupModal";

const GroupContainer: React.FC = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h1>Groups</h1>
            <Input
                placeholder="Search groups..."
                mb="3"
                mt="3"
                size="lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <GroupModal isOpen={isGroupModalOpen} onClose={handleModalClose} onSave={handleModalSave} title="Edit Group"
                        group={selectedGroup}/>
            <Accordion defaultIndex={[0]} allowMultiple>
                {filteredGroups.map((group) => (
                    <AccordionItem key={group.id} border="1px solid #E2E8F0" p={4}>
                        <AccordionButton>
                            <Flex flex="1" textAlign="left" fontSize="lg">
                                <b>{group.name}</b>
                                <Text mx={2}>-</Text>
                                <Text isTruncated maxWidth="200px" fontStyle="italic">
                                    {group.description}
                                </Text>
                            </Flex>
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
                                    if (window.confirm('Are you sure you want to delete this group?')) {
                                        if (group.id) {
                                            dispatch(deleteGroup(group.id) as any);
                                        }
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