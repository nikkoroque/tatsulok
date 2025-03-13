import { useAppDispatch, useAppSelector } from '@/app/redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setCredentials, logout } from '@/auth/authSlice';
import { useLoginMutation } from '@/auth/authApi';
import { Role, rolePermissions } from '@/types/rbac';
import { RootState } from '@/app/redux';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, error } = useAppSelector((state: RootState) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log('Attempting login with:', { username });
      const result = await login({ username, password }).unwrap();
      console.log('Login API response:', result);
      
      // Store token in cookie
      document.cookie = `token=${result.token}; path=/`;
      
      // Update Redux state
      dispatch(setCredentials(result));
      
      // Store auth data in localStorage
      localStorage.setItem('auth', JSON.stringify(result));
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      throw err; // Re-throw to be caught by the login page
    }
  };

  const handleLogout = () => {
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Clear localStorage
    localStorage.removeItem('auth');
    
    // Update Redux state
    dispatch(logout());
    router.push('/login');
  };

  const hasPermission = (action: string, resource: string) => {
    if (!user?.role) return false;
    const permissions = rolePermissions[user.role as Role] || [];
    return permissions.some(
      (permission) =>
        permission.action === action && 
        permission.resource === resource
    );
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    hasPermission,
  };
};