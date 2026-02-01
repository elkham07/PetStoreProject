package passport

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"PetStoreProject/internal/database"
	"PetStoreProject/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAnimals(w http.ResponseWriter, r *http.Request) {
	collection := database.GetCollection("animals")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var animals []models.Animal
	if err := cursor.All(ctx, &animals); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(animals)
}

func CreateAnimal(w http.ResponseWriter, r *http.Request) {
	var animal models.Animal
	if err := json.NewDecoder(r.Body).Decode(&animal); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if animal.Type == "" {
		http.Error(w, "Type is required", http.StatusBadRequest)
		return
	}

	animal.ID = primitive.NewObjectID()

	collection := database.GetCollection("animals")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, animal)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(animal)
}
