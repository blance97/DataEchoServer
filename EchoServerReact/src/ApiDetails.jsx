// ApiDetail.js
import { Box, Heading } from '@chakra-ui/react';

const ApiDetail = ({ name, method, responseCode, responseBody }) => (
    <Box p={4} borderWidth="1px" borderRadius="md">
        <Heading as="h4" size="md">
            {name} - {method}
        </Heading>
        <p>Response Code: {responseCode}</p>
        <p>Response Body: {responseBody}</p>
    </Box>
);

export default ApiDetail;
