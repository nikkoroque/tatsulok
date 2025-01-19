import { Supplier } from "@/models/Supplier";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),

    reducerPath: "api",

    tagTypes: ["Supplier"],

    endpoints: (build) => ({

        // Supplier
        getSuppliers: build.query<Supplier[], void>({
            query: () => "/supplier",
            providesTags: ["Supplier"],
        }),

        createSupplier: build.mutation<Supplier, Supplier>({
            query: (body) => ({
                url: "/supplier",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Supplier"],
        }),

        updateSupplier: build.mutation<Supplier, { id: number; data: Partial<Supplier> }>({
            query: ({ id, data }) => ({
                url: `/supplier/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Supplier"],
        }),

        deleteSupplier: build.mutation<Supplier, number>({
            query: (id) => ({
                url: `/supplier/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Supplier"],
        }),
    }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = api;
