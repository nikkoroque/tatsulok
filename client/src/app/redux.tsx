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

/* REDUX PERSISTENCE */

// Fallback for environments where localStorage is not available (e.g., server-side rendering).
// This prevents issues during server-side rendering (SSR) where window is not available.
const createNoopStorage = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setItem(_key: string, _value: string): Promise<void> {
      return Promise.resolve();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Use the appropriate storage depending on whether the code is running in a browser or not.
// If it's running in the browser, use localStorage; otherwise, use the noop storage.
const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

// Configuration object for Redux Persist to specify the storage type and the state slices to persist.
const persistConfig = {
  key: "root", // The key to use for storing the state in localStorage.
  storage, // The storage engine to use (localStorage or noopStorage).
  whitelist: ["global"], // Specify which slices of the state should be persisted (only 'global' here).
};

// Combine the reducers for global state and the API slice into a root reducer.
const rootReducer = combineReducers({
//   global: globalReducer, // Reducer for the global state slice.
  [api.reducerPath]: api.reducer, // Reducer for API state slice created by RTK Query.
});

// Apply persistence to the root reducer using the persistConfig.
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */

// Function to create and configure the Redux store.
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer, // Use the persisted reducer for the store.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Ignore serialization checks for redux-persist actions to avoid warnings.
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware), // Add the middleware for handling API calls from RTK Query.
  });
};

/* REDUX TYPES */

// Type definitions for the store, state, and dispatch for better type safety.
// This ensures that when interacting with the store or dispatching actions, the types are enforced.
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Typed hooks for using dispatch and selector in components with correct types.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */

// A custom provider component that wraps the Redux Provider and PersistGate.
// This ensures that the Redux store is available to the app, and that state persistence is handled properly.
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode; // Expecting the children prop to be any React node (components, elements, etc.).
}) {
  const storeRef = useRef<AppStore>(); // Use a ref to store the Redux store to ensure it's only created once.

  // If the store hasn't been created yet, initialize it and set up RTK Query listeners.
  if (!storeRef.current) {
    storeRef.current = makeStore(); // Create the Redux store.
    setupListeners(storeRef.current.dispatch); // Set up listeners for refetching data in RTK Query when certain conditions change.
  }

  // Create a persistor, which will manage the persistence of the Redux store.
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children} 
      </PersistGate>
    </Provider>
  );
}