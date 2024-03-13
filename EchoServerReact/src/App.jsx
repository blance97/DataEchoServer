import { ChakraProvider, CSSReset, Box, Flex, extendTheme } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

const theme = extendTheme(/* your theme configuration */);

function App() {
    return (
        <ChakraProvider theme={theme}>
            <CSSReset />
            <Flex>
                <Box w="250px">
                    <Sidebar />
                </Box>
                <Flex flex="1" alignItems="center" justifyContent="center" w="100vw">
                    <MainContent />
                </Flex>
            </Flex>
        </ChakraProvider>
    );
}

export default App;