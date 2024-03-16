import { configureStore } from '@reduxjs/toolkit'
import groupReducer from './features/Groups/GroupSlice'

export const store = configureStore({
    reducer: {
        group: groupReducer,
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch