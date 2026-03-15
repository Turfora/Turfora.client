export type Role = "USER" | "OWNER" | "ADMIN"

export interface RoleSelectorProps<T extends Role = Role> {
  selectedRole: T
  onSelectRole: (role: T) => void
  allowedRoles?: readonly T[]
  disabled?: boolean
}
