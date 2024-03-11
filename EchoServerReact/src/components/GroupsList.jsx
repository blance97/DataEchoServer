import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from '@chakra-ui/react';
import GroupCard from './GroupCard';

const GroupsList = () => {
    // You would fetch groups data from an API here

    const groups = [
        // Sample data
        { id: 1, name: 'Group 1', description: 'Description for Group 1' },
        { id: 2, name: 'Group 2', description: 'Description for Group 2' },
        // Add more groups as needed
    ];

    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            {groups.map((group) => (
                <AccordionItem key={group.id}>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                {group.name}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <GroupCard group={group} />
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default GroupsList;
