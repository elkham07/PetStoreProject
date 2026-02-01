package products

import (
	"PetStoreProject/internal/models"
	"errors"
	"sync"
)

var (
	productsList = make(map[int]models.Product)
	nextID       = 1
	mu           sync.RWMutex
)

// SeedProducts — наполняет систему 20 лошадьми для тестов
func SeedProducts() {
	mu.Lock()
	defer mu.Unlock()

	horses := []struct {
		name  string
		price float64
	}{
		{"Arabian Night", 5500.0}, {"Mustang Spirit", 3200.0}, {"Golden Akhal-Teke", 12000.0},
		{"Black Friesian", 8500.0}, {"Clydesdale Giant", 4500.0}, {"Appaloosa Dot", 3800.0},
		{"Shire King", 5000.0}, {"Lipizzaner Dancer", 7200.0}, {"Icelandic Pony", 2500.0},
		{"Hanoverian Star", 9000.0}, {"Andalusian Pure", 7800.0}, {"Quarter Horse Fast", 4200.0},
		{"Percheron Power", 4800.0}, {"Morgan Classic", 3600.0}, {"Trakehner Elegant", 8200.0},
		{"Paso Fino Smooth", 6500.0}, {"Tennessee Walker", 4100.0}, {"Oldenburg Sport", 9500.0},
		{"Holsteiner Jump", 8800.0}, {"Dartmoor Pony", 2200.0},
	}

	for i, h := range horses {
		id := i + 1
		productsList[id] = models.Product{
			ID:            id,
			Name:          h.name,
			Price:         h.price,
			CategoryID:    1,
			StockQuantity: 1,
			IsAnimal:      true, // Обязательно для паспорта Ернура!
			IsHorse:       true,
			MedicalRecord: "Vaccinated: 2025-01-01; Checkup: Healthy",
		}
		nextID = id + 1
	}
}

// AddProduct
func AddProduct(name string, price float64, categoryID int, stock int) models.Product {
	mu.Lock()
	defer mu.Unlock()

	newProduct := models.Product{
		ID:            nextID,
		Name:          name,
		Price:         price,
		CategoryID:    categoryID,
		StockQuantity: stock,
	}

	productsList[nextID] = newProduct
	nextID++
	return newProduct
}

// GetAllProducts
func GetAllProducts() []models.Product {
	mu.RLock()
	defer mu.RUnlock()

	all := make([]models.Product, 0, len(productsList))
	for _, p := range productsList {
		all = append(all, p)
	}
	return all
}

// GetProductByID
func GetProductByID(id int) (models.Product, error) {
	mu.RLock()
	defer mu.RUnlock()

	p, ok := productsList[id]
	if !ok {
		return models.Product{}, errors.New("product not found")
	}
	return p, nil
}

// UpdateProduct
func UpdateProduct(id int, name string, price float64, stock int) error {
	mu.Lock()
	defer mu.Unlock()

	p, ok := productsList[id]
	if !ok {
		return errors.New("product not found")
	}

	p.Name = name
	p.Price = price
	p.StockQuantity = stock
	productsList[id] = p
	return nil
}

// DeleteProduct
func DeleteProduct(id int) error {
	mu.Lock()
	defer mu.Unlock()

	if _, ok := productsList[id]; !ok {
		return errors.New("product not found")
	}
	delete(productsList, id)
	return nil
}
