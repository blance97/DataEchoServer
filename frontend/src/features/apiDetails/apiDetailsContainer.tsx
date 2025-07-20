import {
    Accordion,
    Box
} from '@chakra-ui/react';
import {useDispatch, useSelector} from "react-redux";
import ApiDetailModel from "../shared/models/apiDetailModel";
import ApiDetailCard from "./components/apiDetailCard";
import {deleteApiDetail, updateApiDetail} from "./apiDetailsSlice";
import React from "react";

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

    const deleteApi = (apiDetailId: number) => {
        // @ts-ignore
        dispatch(deleteApiDetail(apiDetailId));
    }

    return (
        <Accordion allowToggle>
            {(Object.values(apiDetails.byId) as ApiDetailModel[])
                .filter((apiDetail: ApiDetailModel) => apiDetail.groupId === groupId)
                .map((apiDetail: ApiDetailModel) => (
                    <Box key={apiDetail.id} bg="gray.100" borderRadius="md" p={4} my={2} boxShadow="base">
                        <ApiDetailCard apiDetail={apiDetail} updateApi={updateApi} deleteApi={deleteApi}/>
                    </Box>
                ))}
        </Accordion>
    );
};

export default ApiDetailsContainer;