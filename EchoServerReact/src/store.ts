import { configureStore } from '@reduxjs/toolkit'
import groupReducer from './features/Groups/GroupSlice'
import apiDetailsReducer from './features/apiDetails/apiDetailsSlice'
export const store = configureStore({
    reducer: {
        group: groupReducer,
        apiDetails: apiDetailsReducer,
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch