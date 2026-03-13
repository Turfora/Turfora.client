import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export type Role = "USER" | "OWNER" | "ADMIN"

interface RoleSelectorProps {
  selectedRole: Role
  onSelectRole: (role: Role) => void
  allowedRoles?: Role[]
}

const ALL_ROLES: { value: Role; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "USER", label: "User", icon: "person" },
  { value: "OWNER", label: "Owner", icon: "business" },
  { value: "ADMIN", label: "Admin", icon: "shield-checkmark" }
]

export default function RoleSelector({
  selectedRole,
  onSelectRole,
  allowedRoles
}: RoleSelectorProps) {
  const roles = allowedRoles
    ? ALL_ROLES.filter((r) => allowedRoles.includes(r.value))
    : ALL_ROLES

  return (
    <View style={styles.container}>
      <Text style={styles.label}>I am a...</Text>
      <View style={styles.rolesRow}>
        {roles.map((role) => {
          const isSelected = selectedRole === role.value
          return (
            <TouchableOpacity
              key={role.value}
              style={[styles.roleButton, isSelected && styles.roleButtonSelected]}
              onPress={() => onSelectRole(role.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={role.label}
            >
              <Ionicons
                name={role.icon}
                size={22}
                color={isSelected ? "#fff" : "#2E86DE"}
              />
              <Text style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}>
                {role.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10
  },
  rolesRow: {
    flexDirection: "row",
    gap: 10
  },
  roleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2E86DE",
    backgroundColor: "#fff",
    gap: 6
  },
  roleButtonSelected: {
    backgroundColor: "#2E86DE"
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E86DE"
  },
  roleLabelSelected: {
    color: "#fff"
  }
})
