package orders

import (
	"PetStoreProject/internal/models"
	"sync"
	"time"
)

var (
	ordersList  = make(map[int]models.Order)
	nextOrderID = 1
	mu          sync.Mutex
)

// CreateOrder
func CreateOrder(userID int) models.Order {
	mu.Lock()
	defer mu.Unlock()

	newOrder := models.Order{
		ID:        nextOrderID,
		UserID:    userID,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	ordersList[nextOrderID] = newOrder
	nextOrderID++
	return newOrder
}

// GetOrdersByUser
func GetOrdersByUser(userID int) []models.Order {
	mu.Lock()
	defer mu.Unlock()

	var userOrders []models.Order
	for _, o := range ordersList {
		if o.UserID == userID {
			userOrders = append(userOrders, o)
		}
	}
	return userOrders
}
