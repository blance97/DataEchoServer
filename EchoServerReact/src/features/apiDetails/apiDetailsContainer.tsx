import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Text,
    AccordionIcon,
    Button, Td, Input, Tr, Table, Thead, Th, Tbody, Select,
    VStack, Textarea, FormLabel, Flex
} from '@chakra-ui/react';
import {useDispatch, useSelector} from "react-redux";
import ApiDetailModel from "../shared/models/apiDetailModel";
import ApiDetailCard from "./components/apiDetailCard";
import {updateApiDetail} from "./apiDetailsSlice";

interface ApiDetailsContainerProps {
    groupId: number;
}
const ApiDetailsContainer: React.FC<ApiDetailsContainerProps> = ({groupId}) => {
    const dispatch = useDispatch();
    const apiDetails = useSelector((state: any) => state.apiDetails);

    const updateApi = (apiDetail: ApiDetailModel) => {
        // @ts-ignore
        dispatch(updateApiDetail(apiDetail));
    }

    return (
        <Accordion allowToggle>
            {(Object.values(apiDetails.byId) as ApiDetailModel[])
                .filter((apiDetail: ApiDetailModel) => apiDetail.groupId === groupId)
                .map((apiDetail: ApiDetailModel) => (
                    <Box key={apiDetail.id} bg="gray.100" borderRadius="md" p={4} my={2} boxShadow="base">
                        <ApiDetailCard apiDetail={apiDetail} updateApi={updateApi}/>
                    </Box>
                ))}
        </Accordion>
    );
};

export default ApiDetailsContainer;