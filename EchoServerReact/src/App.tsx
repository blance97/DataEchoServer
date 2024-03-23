import {ChakraProvider, CSSReset, Box, Flex, extendTheme} from '@chakra-ui/react';
import Sidebar from './features/shared/Sidebar';
import MainContent from './features/shared/MainContent';
import {Provider} from "react-redux";
import {store} from "./store";
import "react-toastify/dist/ReactToastify.css";
import {Bounce, ToastContainer} from "react-toastify";
import LoggingContainer from "./features/console/LoggingContainer";

const theme = extendTheme(/* your theme configuration */);

function App() {
    return (
        <Provider store={store}>

            <ChakraProvider theme={theme}>
                <CSSReset/>
                <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                />
                <Flex w="100vw">
                    <Box w="250px">
                        <Sidebar/>
                    </Box>
                    <Flex flex="1" alignItems="center" justifyContent="center" maxWidth='100%'>
                        <MainContent/>
                    </Flex>
                    <Flex flex="1" height="100%" mr="500" maxWidth='100%'>
                        <LoggingContainer/>
                    </Flex>
                </Flex>
            </ChakraProvider>
        </Provider>
    );
}

export default App;