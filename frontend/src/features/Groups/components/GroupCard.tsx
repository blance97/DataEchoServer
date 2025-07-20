import {Box, Text} from '@chakra-ui/react';
import {GroupModel} from "../../shared/models/groupModel";
import ApiDetailsContainer from "../../apiDetails/apiDetailsContainer";

const GroupCard = ({group}: { group: GroupModel }) => {
    return (
        <Box borderRadius="lg" p="4">
            {group.id && <ApiDetailsContainer groupId={group.id}/>}
        </Box>
    );
};

export default GroupCard;