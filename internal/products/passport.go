package products

import (
	"errors"
)

// Passport represents the digital passport data for an animal
type Passport struct {
	Name            string `json:"name"`
	Breed           string `json:"breed"`
	VaccinationDate string `json:"vaccination_date"`
	IsHorse         bool   `json:"is_horse"`
	OwnerID         int    `json:"owner_id"`
	MedicalRecord   string `json:"medical_record"`
}

// GetPassportByID retrieves passport details for a product if it is an animal
func GetPassportByID(id int) (*Passport, error) {
	// Reuse existing functionality to get product
	// Since we are in the same package 'products', we can call GetProductByID directly
	product, err := GetProductByID(id)
	if err != nil {
		return nil, err
	}

	if !product.IsAnimal {
		return nil, errors.New("product is not an animal, no passport available")
	}

	// Mocking some data that might be dynamic or just using what we have
	// In the future, Breed might be a separate field in Product or a joined table
	breed := "Unknown Type"
	if product.IsHorse {
		breed = "Horse"
	}

	return &Passport{
		Name:            product.Name,
		Breed:           breed,
		VaccinationDate: "2025-05-15", // Mock data, or parse from MedicalRecord if structured
		IsHorse:         product.IsHorse,
		OwnerID:         product.OwnerID,
		MedicalRecord:   product.MedicalRecord,
	}, nil
}
