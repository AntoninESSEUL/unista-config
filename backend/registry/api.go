// backend/registry/api.go
package registry

// Service exposes UI registry definitions to the Vue frontend via Wails.
type Service struct{}

// NewService creates a registry Service for Wails binding.
func NewService() *Service {
	return &Service{}
}

// GetEquipmentRegistry returns all equipment UI definitions.
// Internally the registry is keyed by the strongly-typed models.EquipmentType
// for compile-time safety. We convert to a plain string-keyed map here, at
// the Wails-exposed boundary, because the Wails binding generator does not
// reliably support map keys of custom named types — and the frontend
// receives JSON object keys as strings regardless.
func (s *Service) GetEquipmentRegistry() (map[string]EquipmentDefinition, error) {
	typed, err := EquipmentRegistry()
	if err != nil {
		return nil, err
	}

	result := make(map[string]EquipmentDefinition, len(typed))
	for k, v := range typed {
		result[string(k)] = v
	}
	return result, nil
}

// GetEquipmentFieldSections returns collapsible section metadata for equipment forms.
func (s *Service) GetEquipmentFieldSections() ([]EquipmentFieldSection, error) {
	return EquipmentFieldSections()
}

// GetPageRegistry returns all page UI definitions.
func (s *Service) GetPageRegistry() (map[string]PageDefinition, error) {
	return PageRegistry()
}