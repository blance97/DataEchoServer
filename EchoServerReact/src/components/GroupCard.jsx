import { Box, Text } from '@chakra-ui/react';

const GroupCard = ({ group }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" p="4">
            <Text fontWeight="bold">{group.name}</Text>
            <Text>{group.description}</Text>
            {/* Add API details or other information */}
        </Box>
    );
};

export default GroupCard;
