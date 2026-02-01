package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name     string             `bson:"name" json:"name"`
	Email    string             `bson:"email" json:"email"`
	Password string             `bson:"password" json:"password"`
	Role     string             `bson:"role" json:"role"`
}

type Animal struct {
	ID             primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	RFIDTag        string                 `bson:"rfid_tag" json:"rfid_tag"`
	OwnerID        primitive.ObjectID     `bson:"owner_id" json:"owner_id"`
	Type           string                 `bson:"type" json:"type"`
	Breed          string                 `bson:"breed" json:"breed"`
	Lineage        Lineage                `bson:"lineage" json:"lineage"`
	MedicalHistory []MedicalRecord        `bson:"medical_history" json:"medical_history"`
	Attributes     map[string]interface{} `bson:"attributes" json:"attributes"`
}

type Lineage struct {
	SireID primitive.ObjectID `bson:"sire_id,omitempty" json:"sire_id"`
	DamID  primitive.ObjectID `bson:"dam_id,omitempty" json:"dam_id"`
}

type MedicalRecord struct {
	Date         string `bson:"date" json:"date"`
	Vaccine      string `bson:"vaccine" json:"vaccine"`
	VetSignature string `bson:"vet_signature" json:"vet_signature"`
}

type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SellerID    primitive.ObjectID `bson:"seller_id" json:"seller_id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	Price       float64            `bson:"price" json:"price"`
	Stock       int                `bson:"stock" json:"stock"`
	Category    string             `bson:"category" json:"category"`
	ImageURL    string             `bson:"image_url" json:"image_url"`
}

type Order struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID     primitive.ObjectID `bson:"user_id" json:"user_id"`
	Status     string             `bson:"status" json:"status"`
	TotalPrice float64            `bson:"total_price" json:"total_price"`
	Items      []OrderItem        `bson:"items" json:"items"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}

type OrderItem struct {
	ProductID       primitive.ObjectID `bson:"product_id" json:"product_id"`
	Name            string             `bson:"name" json:"name"`
	PriceAtPurchase float64            `bson:"price_at_purchase" json:"price_at_purchase"`
	Quantity        int                `bson:"quantity" json:"quantity"`
}
