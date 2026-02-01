package auth

import (
	"PetStoreProject/internal/models"
	"errors"
	"sync"
)

var (
	users = make(map[string]models.User)
	mu    sync.Mutex
)

// Register
func Register(name, email, password, role string) (models.User, error) {
	mu.Lock()
	defer mu.Unlock()

	if _, exists := users[email]; exists {
		return models.User{}, errors.New("user already exists")
	}

	newUser := models.User{
		ID:       len(users) + 1,
		Name:     name,
		Email:    email,
		Password: password,
		Role:     role,
	}

	users[email] = newUser
	return newUser, nil
}
