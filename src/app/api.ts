import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
}

interface TokenResponse {
  access_token?: string;
  token?: string;
  accessToken?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl:
    typeof window !== "undefined" && window.location.origin
      ? `${window.location.origin}/`
      : "http://localhost/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<
      TokenResponse,
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/oauth/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: credentials.username,
          client_secret: credentials.password,
        }).toString(),
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/oauth/logout", method: "POST" }),
    }),
  }),
});

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserRecord[], void>({
      query: () => "/api/users",
      providesTags: ["Users"],
    }),
    getUserById: builder.query<UserRecord, string>({
      query: (id) => `/api/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation<UserRecord, CreateUserPayload>({
      query: (body) => ({ url: "/api/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      UserRecord,
      { id: string; payload: CreateUserPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    patchUser: builder.mutation<
      UserRecord,
      { id: string; payload: Partial<CreateUserPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/api/users/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  usePatchUserMutation,
  useDeleteUserMutation,
} = usersApi;
