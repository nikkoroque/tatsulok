"use client";

import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import { api } from "@/api/api";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import for Redux Persist, which allows the Redux store to persist across sessions.
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from '@/auth/authSlice';

/* REDUX PERSISTENCE */

// Storage configuration
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

// Use the appropriate storage depending on whether the code is running in a browser or not.
// If it's running in the browser, use localStorage; otherwise, use the noop storage.
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Configuration object for Redux Persist to specify the storage type and the state slices to persist.
const persistConfig = {
  key: "root", // The key to use for storing the state in localStorage.
  storage,
  whitelist: ['auth'], // Only persist auth state
};

// Combine the reducers for global state and the API slice into a root reducer.
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer, // Reducer for API state slice created by RTK Query.
  auth: authReducer,
});

// Apply persistence to the root reducer using the persistConfig.
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */

// Function to create and configure the Redux store.
const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */

// Type definitions for the store, state, and dispatch for better type safety.
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

/* PROVIDER */

// A custom provider component that wraps the Redux Provider and PersistGate.
// This ensures that the Redux store is available to the app, and that state persistence is handled properly.
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create store ref
  const storeRef = useRef<AppStore>();

  // Initialize store if it hasn't been created yet
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  // Ensure store is available before rendering children
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistStore(storeRef.current)}>
        {children}
      </PersistGate>
    </Provider>
  );
}

// Define hooks as function declarations to prevent immediate execution
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;