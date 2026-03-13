import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

export type Role = "USER" | "OWNER" | "ADMIN"

interface RoleSelectorProps {
  selectedRole: Role
  onSelectRole: (role: Role) => void
  allowedRoles?: Role[]
  disabled?: boolean
}

const ROLE_CONFIG: Record<Role, { label: string; icon: string; description: string; color: string }> = {
  USER: {
    label: "User",
    icon: "person",
    description: "Browse and book turfs",
    color: "#2E86DE",
  },
  OWNER: {
    label: "Owner",
    icon: "briefcase",
    description: "List and manage turfs",
    color: "#A23B72",
  },
  ADMIN: {
    label: "Admin",
    icon: "settings",
    description: "Manage platform",
    color: "#F18F01",
  },
}

export default function RoleSelector({
  selectedRole,
  onSelectRole,
  allowedRoles = ["USER", "OWNER", "ADMIN"],
  disabled = false,
}: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const availableRoles = allowedRoles.filter((role) => allowedRoles.includes(role))
  const selectedRoleConfig = ROLE_CONFIG[selectedRole]

  const handleSelectRole = (role: Role) => {
    onSelectRole(role)
    setIsOpen(false)
  }

  return (
    <>
      {/* Role Selector Button */}
      <TouchableOpacity
        style={[styles.selectorButton, disabled && styles.selectorButtonDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Select role: ${selectedRoleConfig.label}`}
      >
        <View style={styles.selectorContent}>
          <View style={styles.leftContent}>
            <View style={[styles.iconCircle, { backgroundColor: `${selectedRoleConfig.color}20` }]}>
              <Ionicons
                name={selectedRoleConfig.icon as any}
                size={20}
                color={selectedRoleConfig.color}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Account Type</Text>
              <Text style={[styles.selectedValue, { color: selectedRoleConfig.color }]}>
                {selectedRoleConfig.label}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </View>
      </TouchableOpacity>

      {/* Role Selection Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Your Role</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <Ionicons name="close" size={28} color="#1A1A2E" />
              </TouchableOpacity>
            </View>

            {/* Role Options */}
            <FlatList
              data={availableRoles}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              renderItem={({ item: role }) => {
                const config = ROLE_CONFIG[role]
                const isSelected = selectedRole === role

                return (
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      isSelected && [
                        styles.roleOptionSelected,
                        { borderLeftColor: config.color, backgroundColor: `${config.color}08` },
                      ],
                    ]}
                    onPress={() => handleSelectRole(role)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${config.label}: ${config.description}`}
                  >
                    <View style={styles.roleOptionContent}>
                      {/* Role Icon */}
                      <View style={[styles.roleIconContainer, { backgroundColor: `${config.color}15` }]}>
                        <Ionicons name={config.icon as any} size={24} color={config.color} />
                      </View>

                      {/* Role Info */}
                      <View style={styles.roleInfo}>
                        <Text style={[styles.roleName, { color: config.color }]}>
                          {config.label}
                        </Text>
                        <Text style={styles.roleDescription}>{config.description}</Text>
                      </View>
                    </View>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <View style={[styles.selectionIndicator, { backgroundColor: config.color }]}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                )
              }}
            />

            {/* Modal Footer Info */}
            <View style={styles.modalFooter}>
              <Ionicons name="information-circle-outline" size={16} color="#888" />
              <Text style={styles.footerInfo}>
                You can change your role anytime in settings
              </Text>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: selectedRoleConfig.color },
              ]}
              onPress={() => setIsOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Confirm selection"
            >
              <Text style={styles.confirmButtonText}>Confirm Selection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  selectorButton: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },
  selectorButtonDisabled: {
    opacity: 0.6,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    marginBottom: 2,
  },
  selectedValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  roleOptionSelected: {
    borderLeftWidth: 3,
  },
  roleOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  roleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 12,
    color: "#888",
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  footerInfo: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  confirmButton: {
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
})