import {Box, Text} from '@chakra-ui/react';
import {GroupModel} from "../../shared/models/groupModel";

const GroupCard = ({group}: { group: GroupModel }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" p="4">
            <Text><b>Description:</b> {group.description}</Text>
            {/* Add API details or other information */}
        </Box>
    );
};

export default GroupCard;