export type Role = 'Admin' | 'Staff';

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: 'products' | 'categories' | 'suppliers' | 'users' | 'transactions';
}

export const rolePermissions: Record<Role, Permission[]> = {
  Admin: [
    // Admin has full access to everything
    { action: 'create', resource: 'products' },
    { action: 'read', resource: 'products' },
    { action: 'update', resource: 'products' },
    { action: 'delete', resource: 'products' },
    // Categories
    { action: 'create', resource: 'categories' },
    { action: 'read', resource: 'categories' },
    { action: 'update', resource: 'categories' },
    { action: 'delete', resource: 'categories' },
    // Suppliers
    { action: 'create', resource: 'suppliers' },
    { action: 'read', resource: 'suppliers' },
    { action: 'update', resource: 'suppliers' },
    { action: 'delete', resource: 'suppliers' },
    // Users
    { action: 'create', resource: 'users' },
    { action: 'read', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'delete', resource: 'users' },
    // Transactions
    { action: 'create', resource: 'transactions' },
    { action: 'read', resource: 'transactions' },
    { action: 'update', resource: 'transactions' },
    { action: 'delete', resource: 'transactions' },
  ],
  Staff: [
    // Staff has limited access
    { action: 'read', resource: 'products' },
    { action: 'read', resource: 'categories' },
    { action: 'read', resource: 'suppliers' },
    { action: 'read', resource: 'transactions' },
    { action: 'create', resource: 'transactions' },
    { action: 'update', resource: 'transactions' },
    // Add basic user read permission for Staff
    { action: 'read', resource: 'users' },
  ]
};