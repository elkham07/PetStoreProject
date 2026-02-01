package models

import "time"

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type Product struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	Price         float64 `json:"price"`
	CategoryID    int     `json:"category_id"`
	StockQuantity int     `json:"stock_quantity"`
	IsAnimal      bool

	// Fields for Digital Passport
	OwnerID       int    `json:"owner_id"`
	IsHorse       bool   `json:"is_horse"`
	MedicalRecord string `json:"medical_record"`
}

type Order struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
