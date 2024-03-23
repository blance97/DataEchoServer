import { Box } from '@chakra-ui/react';
import GroupContainer from "../Groups/containers/GroupContainer";
import {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {fetchAllGroups} from "../Groups/GroupSlice";
import {fetchAllApiDetails} from "../apiDetails/apiDetailsSlice";
import loggingContainer from "../logs/LoggingContainer";

const MainContent = () => {
    const dispatch = useDispatch();
    useEffect(() => {
            // @ts-ignore
            dispatch(fetchAllGroups());
            // @ts-ignore
            dispatch(fetchAllApiDetails());
        },
        []);
    return (
        <Box p="4" w="100%">
            <GroupContainer/>
        </Box>
    );
};

export default MainContent;