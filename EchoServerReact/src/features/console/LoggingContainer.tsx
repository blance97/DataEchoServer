import { Box, VStack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const LoggingContainer = () => {
    const logs = useSelector((state: RootState) => state.logs);

    return (
        <Box position="fixed" right="0" width="30%" height="100%" bg="gray.500" p="4" overflowY="auto">
            <VStack align="start" spacing={4}>
                {/*{console.map((log, index) => (*/}
                {/*    <Box key={index} p="4" bg="white" borderRadius="md" boxShadow="base" width="100%">*/}
                {/*        <Text fontWeight="bold">{log.method} {log.endpoint}</Text>*/}
                {/*        <Text>Request Body: {JSON.stringify(log.requestBody)}</Text>*/}
                {/*        <Text>Response Status: {log.responseStatus}</Text>*/}
                {/*        <Text>Response Body: {JSON.stringify(log.responseBody)}</Text>*/}
                {/*    </Box>*/}
                {/*))}*/}
            </VStack>
        </Box>
    );
};

export default LoggingContainer;