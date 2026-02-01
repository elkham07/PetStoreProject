package consultation

import (
	"PetStoreProject/internal/models"
	"errors"
	"fmt"
	"sync"
	"time"
)

var (
	consultations = make(map[int]*models.Consultation)
	nextID        = 1
	mu            sync.RWMutex
)

// StartConsultation initiates a new consultation session
func StartConsultation(userID, vetID, productID int) *models.Consultation {
	mu.Lock()
	defer mu.Unlock()

	c := &models.Consultation{
		ID:        nextID,
		UserID:    userID,
		VetID:     vetID,
		ProductID: productID,
		Messages:  make([]models.Message, 0),
		Active:    true,
	}
	consultations[nextID] = c
	nextID++
	return c
}

// SendMessage adds a message to the consultation and logs it asynchronously
func SendMessage(consultationID, senderID int, content string) error {
	mu.Lock()
	defer mu.Unlock()

	c, ok := consultations[consultationID]
	if !ok {
		return errors.New("consultation not found")
	}

	if !c.Active {
		return errors.New("consultation is closed")
	}

	msg := models.Message{
		ID:        len(c.Messages) + 1,
		SenderID:  senderID,
		Content:   content,
		Timestamp: time.Now(),
	}

	c.Messages = append(c.Messages, msg)

	// Async logging (Goroutine) - Concurrency requirement
	go func(m models.Message, cID int) {
		// Simulate some heavy logging operation
		time.Sleep(500 * time.Millisecond)
		fmt.Printf("[LOG] New message in Consultation #%d from User %d: %s\n", cID, m.SenderID, m.Content)
	}(msg, consultationID)

	return nil
}

// GetConsultation retrieves a consultation by ID
func GetConsultation(id int) (*models.Consultation, error) {
	mu.RLock()
	defer mu.RUnlock()

	c, ok := consultations[id]
	if !ok {
		return nil, errors.New("consultation not found")
	}
	return c, nil
}
