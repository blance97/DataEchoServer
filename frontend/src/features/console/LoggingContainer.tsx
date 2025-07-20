import React, { useState, useEffect, useRef } from 'react';
import {Textarea, Text, Button, Box} from "@chakra-ui/react";
import {JsonView, allExpanded, darkStyles, defaultStyles, collapseAllNested} from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const LoggingContainer = () => {
    const [logs, setLogs] = useState<String[]>([]);
    const logsEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8081');

        ws.onopen = () => {
            console.log('WebSocket is connected');
        };

        ws.onmessage = (event) => {
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
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    return (
        <Box width="100%">
            <Text fontWeight="bold" mb="4">Logs</Text>
            <Box overflowY="auto" maxHeight="60vh">
                {logs.map((value:any, index) => {
                    let decodedValue = JSON.parse(value);
                    if (typeof decodedValue.responseBody === 'string') {
                        try {
                            decodedValue.responseBody = JSON.parse(decodedValue.responseBody);
                        } catch (error) {
                            // responseBody is not a stringified JSON, do nothing
                        }
                    }
                    return (<Box key={index}>
                        <Text><b>{decodedValue.timestamp}</b></Text>
                        <JsonView data={decodedValue} shouldExpandNode={collapseAllNested}/>
                    </Box>)
                })}
                <div ref={logsEndRef} />
            </Box>
            <Button colorScheme="teal" variant="outline" mt="4" onClick={() => setLogs([])}>
                Clear
            </Button>
        </Box>
    );
};

export default LoggingContainer;