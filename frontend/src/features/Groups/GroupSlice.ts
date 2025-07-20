import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {GroupModel} from "../shared/models/groupModel";
import ApiResponseModel from "../shared/models/apiResponseModel";
import {toast} from "react-toastify";

export const fetchAllGroups = createAsyncThunk(
    'group/',
    async (_, {rejectWithValue}) => {
        try {
            const response = await fetch('/api/des/groups');
            const responseBody: ApiResponseModel = await response.json();
            if (!response.ok) {
                toast.error(`Client error occurred: ${responseBody.message}`);
                return rejectWithValue("Client error occurred");
            }
            return responseBody;
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
            return rejectWithValue(error.toString());
        }
    }
);
export const addGroupAsync = createAsyncThunk(
    'group/addGroup',
    async (groupData: GroupModel, {rejectWithValue}) => {
        try {
            const response = await fetch('/api/des/groups', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(groupData),
            });
            const responseBody: ApiResponseModel = await response.json();
            if (!response.ok) {
                toast.error(`Client error occurred: ${responseBody.message}`);
                return rejectWithValue("Client error occurred");
            }
            toast.success('Group added successfully')
            return responseBody;
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
            return rejectWithValue(error.toString());
        }
    }
);

export const updateGroup = createAsyncThunk(
    'group/updateGroup',
    async (groupData: GroupModel, {rejectWithValue}) => {
        try {
            const response = await fetch(`/api/des/groups/${groupData.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(groupData),
            });
            const responseBody: ApiResponseModel = await response.json();
            if (!response.ok) {
                toast.error(`Client error occurred: ${responseBody.message}`);
                return rejectWithValue("Client error occurred");
            }
            toast.success('Group updated successfully')
            return responseBody;
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
            return rejectWithValue(error.toString());
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'group/deleteGroup',
    async (groupId: number, {rejectWithValue}) => {
        try {
            const response = await fetch(`/api/des/groups/${groupId}`, {
                method: 'DELETE',
            });
            const responseBody: ApiResponseModel = await response.json();
            if (!response.ok) {
                toast.error(`Client error occurred: ${responseBody.message}`);
                return rejectWithValue("Client error occurred");
            }
            toast.success('Group deleted successfully')
            return groupId;
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
            return rejectWithValue(error.toString());
        }
    }
);

const groupSlice = createSlice({
    name: 'group',
    initialState: {groups: [] as GroupModel[], groupIds: [] as number[], status: 'idle', error: null as string | null},
    reducers: {
        addGroup(state, action) {
            const group = action.payload;
            state.groups.push(group);
            if (group.id !== undefined) {
                state.groupIds.push(group.id);
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(addGroupAsync.pending, state => {
            state.status = 'loading';
        });
        builder.addCase(addGroupAsync.fulfilled, (state, action) => {
            const group: GroupModel = action.payload.data;
            group.apiDetails = [];
            state.status = 'idle';
            state.groups.push(group);
            if (group.id !== undefined) {//TODO check if this is needed
                state.groupIds.push(group.id);
            }
        });
        builder.addCase(addGroupAsync.rejected, (state, action) => {
            state.status = 'error';
            state.error = action.error.message ?? 'An error occurred';
        });
        builder.addCase(updateGroup.fulfilled, (state, action) => {
            state.status = 'idle';
            const updatedGroup: GroupModel = action.payload.data;
            const index = state.groups.findIndex(group => group.id === updatedGroup.id);
            state.groups[index] = updatedGroup;
        });
        builder.addCase(fetchAllGroups.fulfilled, (state, action) => {
            state.status = 'idle';
            state.groups = action.payload.data;
        });
        builder.addCase(deleteGroup.fulfilled, (state, action) => {
            state.status = 'idle';
            state.groups = state.groups.filter(group => group.id !== action.payload);
        });
    },
});

export const {addGroup} = groupSlice.actions;
export default groupSlice.reducer;