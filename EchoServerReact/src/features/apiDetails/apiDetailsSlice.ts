import { createSlice } from '@reduxjs/toolkit';

const groupSlice = createSlice({
    name: 'groups',
    initialState: {
        byId: {},
        allIds: [],
    },
    reducers: {
        addGroup(state, action) {
            const { id } = action.payload;
            state.byId[id] = action.payload;
            state.allIds.push(id);
        },
        addApiDetail(state, action) {
            const { groupId, id } = action.payload;
            state.byId[groupId].apiDetails = [...(state.byId[groupId].apiDetails || []), id];
        },
    },
});

export const { addGroup, addApiDetail } = groupSlice.actions;
export default groupSlice.reducer;
