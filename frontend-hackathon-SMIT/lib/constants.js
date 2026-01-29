export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

export const ROLE_LABELS = {
  admin: 'Administrator',
  manager: 'Manager',
  staff: 'Staff',
};

export const ROLE_PERMISSIONS = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users'],
  manager: ['create', 'read', 'update', 'manage_inventory'],
  staff: ['read'],
};

export const canPerformAction = (userRole, action) => {
  return ROLE_PERMISSIONS[userRole]?.includes(action) || false;
};

export const generateBarcode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}${random}`.slice(-12);
};
