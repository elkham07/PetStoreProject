package main

import (
	"PetStoreProject/internal/auth"
	"fmt"
	"net/http"
)

func main() {
	// Маршрут для регистрации
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {

		user, err := auth.Register("Elkham", "elkham@example.com", "securePass", "Customer")

		if err != nil {
			fmt.Fprintf(w, "Error: %s", err)
			return
		}

		fmt.Fprintf(w, "Success! User %s created with role %s", user.Name, user.Role)
	})

	fmt.Println("Server is running on http://localhost:5090")

	http.ListenAndServe(":5090", nil)
}
