import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import ApiDetailModel from "../shared/models/apiDetailModel";
import ApiResponseModel from "../shared/models/apiResponseModel";
import {toast} from "react-toastify";

export const fetchAllApiDetails = createAsyncThunk<
    ApiResponseModel, // Return type of the payload creator
    void, // First argument to the payload creator
    { rejectValue: string } // Override ThunkAPI
>(
    'apiDetails/', async (_, {rejectWithValue}) => {
        try {
            const response = await fetch('/api/des/apiDetails/getAll');
            const responseBody = await response.json();
            if (!response.ok) {
                return rejectWithValue(responseBody);
            }
            return responseBody;
        } catch (error) {
            return rejectWithValue(error.toString());
        }

    });

export const addApiDetailAsync = createAsyncThunk<ApiResponseModel, ApiDetailModel, { rejectValue: string }>(
    'apiDetails/add',
    async (apiDetail, {rejectWithValue}) => {
        try {
            const response = await fetch('/api/des/apiDetails/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiDetail),
            });
            const responseBody = await response.json();
            if (!response.ok) {
                toast.error(`Client error occurred: ${responseBody.message}`);
                return rejectWithValue(responseBody);
            }
            toast.success('API details added successfully')
            return responseBody;
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
            return rejectWithValue(error.toString());
        }
    });

export const updateApiDetail = createAsyncThunk<ApiResponseModel, ApiDetailModel, { rejectValue: string }>(
    'apiDetails/update',
    async (apiDetail, {rejectWithValue}) => {
        try {
            const response = await fetch('/api/des/apiDetails/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiDetail),
            });
            const responseBody = await response.json();
            if (!response.ok) {
                toast.error(`Client error occurred: ${responseBody.message}`);
                return rejectWithValue(responseBody);
            }
            toast.success('API details updated successfully')
            return responseBody;
        } catch (error) {
            toast.error(`Server error occurred: ${error.toString()}`);
            return rejectWithValue(error.toString());
        }
    });

const groupSlice = createSlice({
    name: 'apiDetails',
    initialState: {
        byId: {} as Record<number, ApiDetailModel>,
        allIds: [] as number[],
        status: 'idle',
        error: null as string | null
    },
    reducers: {
        addApiDetail(state: {
            byId: Record<number, ApiDetailModel>;
            allIds: number[];
        }, action: PayloadAction<ApiDetailModel>) {
            const apiDetail = action.payload;
            if (apiDetail.id !== undefined) {
                state.byId[apiDetail.id] = apiDetail;
                state.allIds.push(apiDetail.id);
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchAllApiDetails.pending, state => {
                //TODO
            },
        );
        builder.addCase(fetchAllApiDetails.fulfilled, (state, action) => {
            state.allIds = [];
            state.byId = {};
            action.payload.data.forEach((apiDetail: ApiDetailModel) => {
                if (apiDetail.id !== undefined) {
                    state.byId[apiDetail.id] = apiDetail;
                    state.allIds.push(apiDetail.id);
                }
            });
        });
        builder.addCase(fetchAllApiDetails.rejected, (state, action) => {
            //TODO
        });
        builder.addCase(updateApiDetail.pending, state => {
            //TODO
        });
        builder.addCase(updateApiDetail.fulfilled, (state, action) => {
            const apiDetail = action.payload.data;
            if (apiDetail.id !== undefined) {
                state.byId[apiDetail.id] = apiDetail;
            }
        });
        builder.addCase(updateApiDetail.rejected, (state, action) => {
            state.status = 'idle';
            state.error = action.payload ? action.payload : 'Server error occurred';
        });
        builder.addCase(addApiDetailAsync.pending, state => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(addApiDetailAsync.rejected, (state, action) => {
            state.status = 'idle';
            state.error = action.payload ? action.payload : 'Server error occurred';
        });
        builder.addCase(addApiDetailAsync.fulfilled, (state, action) => {
            const apiDetail = action.payload.data;
            if (apiDetail.id !== undefined) {
                state.byId[apiDetail.id] = apiDetail;
                state.allIds.push(apiDetail.id);
            }
            state.status = 'idle';
            state.error = null;
        });
    }
});

export const {addApiDetail} = groupSlice.actions;
export default groupSlice.reducer;