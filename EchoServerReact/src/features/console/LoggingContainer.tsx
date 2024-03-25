import React, { useState, useEffect, useRef } from 'react';
import {Textarea, Text, Button, Box} from "@chakra-ui/react";


const LoggingContainer = () => {
    const [logs, setLogs] = useState<String[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8081');

        ws.onopen = () => {
            console.log('WebSocket is connected');
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message: ', event.data);
            setLogs((prevLogs: any) => [...prevLogs, event.data]);
        };

        ws.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };

        ws.onclose = () => {
            console.log('WebSocket is closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <Box height="75%">
            <Text fontWeight="bold" mb="4">Logs</Text>
            <Textarea
                ref={textareaRef}
                height="50"
                maxHeight="90%"
                overflowY="auto"
                bg="gray.800"
                color="lime"
                fontFamily="monospace"
                border="1px solid lime"
                p="4"
                resize="vertical"
                value={logs.join('\n----------------\n')}
                readOnly
            >

            </Textarea>
            <Button colorScheme="teal" variant="outline" mt="4" onClick={() => setLogs([])}>
                Clear
            </Button>
        </Box>
    );
};

export default LoggingContainer;