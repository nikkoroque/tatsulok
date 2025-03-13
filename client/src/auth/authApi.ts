import { api } from '@/api/api';
import { Role } from '@/types/rbac';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: {
    user_id: number;
    username: string;
    email?: string;
    role: Role;
  };
  token: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;