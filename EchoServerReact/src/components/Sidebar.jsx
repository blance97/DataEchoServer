import { Box, Text, Button, Flex } from '@chakra-ui/react';

const Sidebar = () => {
    return (
        <Box bg="gray.200" p="4" h="100vh" w="250px" position="fixed" left="0" top="0">
            <Text fontWeight="bold" mb="4">Menu</Text>
            <Flex direction="column">
                <Button colorScheme="blue" mb="2">Add Group</Button>
                <Button colorScheme="blue">Add API</Button>
            </Flex>
            {/* Add other sidebar items as needed */}
        </Box>
    );
};

export default Sidebar;