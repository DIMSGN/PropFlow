// User Role Constants
export const USER_ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.AGENT]: "Agent",
};

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: USER_ROLE_LABELS[USER_ROLES.ADMIN] },
  { value: USER_ROLES.AGENT, label: USER_ROLE_LABELS[USER_ROLES.AGENT] },
];
