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
