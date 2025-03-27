import { Category } from "@/models/Category";
import { Supplier } from "@/models/Supplier";
import { Transaction } from "@/models/Transaction";
import {Product} from "@/models/Products"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/redux";
import { User } from "@/models/User";

export const api = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            // Get token from Redux store
            const token = (getState() as RootState).auth.token;
            
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    reducerPath: "api",
    tagTypes: ["Supplier", "Category", "Transaction", "Product", "User"],

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

        validateSupplier: build.query<boolean, string>({
            query: (name) => `/supplier/validate/${name}`,
            providesTags: ["Supplier"],
        }),

        // Category
        getCategories: build.query<Category[], void>({
            query: () => "/categories",
            providesTags: ["Category"],
        }),

        createCategory: build.mutation<Category, Category>({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        updateCategory: build.mutation<Category, { id: number; data: Partial<Category> }>({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Category"],
        }),

        deleteCategory: build.mutation<Category, number>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

        validateCategory: build.query<boolean, string>({
            query: (name) => `/categories/validate/${name}`,
            providesTags: ["Category"],
        }),

        // Transaction
        getTransactions: build.query<Transaction[], void>({
            query: () => "/transactions",
            providesTags: ["Transaction"],
        }),

        createTransaction: build.mutation<Transaction, Transaction>({
            query: (body) => ({
                url: "/transactions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Transaction"],
        }),

        voidTransaction: build.mutation<Transaction, { id: number; voidReason: string }>({
            query: ({ id, voidReason }) => ({
                url: `/transactions/${id}/void`,
                method: "POST",
                body: { voidReason },
            }),
            invalidatesTags: ["Transaction"],
        }),

        updateTransaction: build.mutation<Transaction, { id: number; data: Partial<Transaction> }>({
            query: ({ id, data }) => ({
                url: `/transactions/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Transaction"],
        }),

        //Products
        getProducts: build.query<Product[], void>({
            query: () => "/products",
            providesTags: ["Product"],
        }),

        createProduct: build.mutation<Product, Product>({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Product"],
        }),
        
        updateProduct: build.mutation<Product, { id: number; data: Partial<Product> }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Product"],
        }),
        
        deleteProduct: build.mutation<Product, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        
        validateProduct: build.query<boolean, string>({
            query: (name) => `/products/validate/${name}`,
            providesTags: ["Product"],
        }),

        //Users
        getUsers: build.query<User[], void>({
            query: () => "/users",
            providesTags: ["User"],
        }),

        createUser: build.mutation<User, User>({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        updateUser: build.mutation<User, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["User"],
        }),
        
        deleteUser: build.mutation<User, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        validateUser: build.query<boolean, string>({
            query: (email) => `/users/validate/${email}`,
            providesTags: ["User"],
        }),
    }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useValidateSupplierQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useValidateCategoryQuery,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useVoidTransactionMutation,
  useUpdateTransactionMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useValidateProductQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useValidateUserQuery,
} = api;