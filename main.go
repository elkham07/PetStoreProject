package main

import (
	"PetStoreProject/internal/auth"
	"PetStoreProject/internal/orders"
	"PetStoreProject/internal/products"
	"fmt"
	"net/http"
)

func main() {
	products.SeedProducts()

	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {

		user, err := auth.Register("Elkham", "elkham@example.com", "securePass", "Customer")

		if err != nil {
			fmt.Fprintf(w, "Error: %s", err)
			return
		}

		fmt.Fprintf(w, "Success! User %s created with role %s", user.Name, user.Role)
	})

	// Внутри func main() после регистрации:
	http.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			// Имитация добавления товара
			p := products.AddProduct("Horse Feed", 25.50, 1, 100)
			fmt.Fprintf(w, "Added: %s (Price: %.2f)", p.Name, p.Price)
		} else {
			// Показать все
			all := products.GetAllProducts()
			fmt.Fprintf(w, "Total products: %d", len(all))
		}
	})

	// Маршрут для получения одного товара (активирует GetProductByID)
	http.HandleFunc("/product", func(w http.ResponseWriter, r *http.Request) {
		// Для теста запрашиваем ID = 1
		p, err := products.GetProductByID(1)
		if err != nil {
			fmt.Fprintf(w, "Error: %s", err)
			return
		}
		fmt.Fprintf(w, "Found Product: %s, Price: %.2f", p.Name, p.Price)
	})

	http.HandleFunc("/product/update", func(w http.ResponseWriter, r *http.Request) {

		products.UpdateProduct(1, "Updated Horse", 500.0, 5)
		fmt.Fprint(w, "Product updated")
	})

	http.HandleFunc("/product/delete", func(w http.ResponseWriter, r *http.Request) {
		// Допустим, мы удаляем товар с ID 1
		err := products.DeleteProduct(1)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		fmt.Fprintf(w, "Product with ID 1 deleted successfully")
	})

	http.HandleFunc("/order/create", func(w http.ResponseWriter, r *http.Request) {

		newOrder := orders.CreateOrder(1)
		fmt.Fprintf(w, "Order #%d created at %s", newOrder.ID, newOrder.CreatedAt.Format("15:04:05"))
	})

	http.HandleFunc("/orders", func(w http.ResponseWriter, r *http.Request) {

		userOrders := orders.GetOrdersByUser(1)
		fmt.Fprintf(w, "User #1 has %d orders in system", len(userOrders))
	})

	fmt.Println("Server is running on http://localhost:5090")

	http.ListenAndServe(":5090", nil)
}
