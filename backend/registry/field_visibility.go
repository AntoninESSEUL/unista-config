// backend/registry/field_visibility.go
package registry

import (
	"my-machine-app/backend/models"
)

// IsConfigFieldVisible evaluates global visibility constraints for equipment fields.
// Specific UI rendering logic has been migrated to frontend rule providers
// to maintain a strict separation of concerns and eliminate UI/Backend coupling.
func IsConfigFieldVisible(equipmentType models.EquipmentType, equipment map[string]any, field string) bool {
	enabled, ok := equipment["enable"].(bool)
	if !ok || !enabled {
		return false
	}

	// Dynamic UI field-gating rules are now exclusively managed by the frontend
	return true
}