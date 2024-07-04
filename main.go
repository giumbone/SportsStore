package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type Order struct {
	ProductID int
	Quantity  int
}

func loadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file:", err)
	}
}

func getDBConnection() (*sql.DB, error) {
	loadEnv()
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME")))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	return db, nil
}

func validateStock(db *sql.DB, productID, quantity int) bool {
	var stock int
	err := db.QueryRow("SELECT stock FROM products WHERE id = ?", productID).Scan(&stock)
	if err != nil || stock < quantity {
		return false
	}
	return true
}

func updateStock(db *sql.DB, productID, quantity int) error {
	if _, err := db.Exec("UPDATE products SET stock = stock - ? WHERE id = ?", quantity, productID); err != nil {
		return fmt.Errorf("failed to update stock: %w", err)
	}
	return nil
}

func confirmOrder(order Order) (bool, error) {
	db, err := getDBConnection()
	if err != nil {
		return false, fmt.Errorf("error getting DB connection: %w", err)
	}
	defer db.Close()

	if !validateStock(db, order.ProductID, order.Quantity) {
		return false, nil
	}

	if err := updateStock(db, order.ProductID, order.Quantity); err != nil {
		return false, fmt.Errorf("error updating stock: %w", err)
	}

	return true, nil
}

func main() {
	order := Order{ProductID: 1, Quantity: 2}
	success, err := confirmOrder(order)
	if err != nil {
		log.Fatalf("Order confirmation failed: %v", err)
	}
	if success {
		fmt.Println("Order confirmed successfully")
	} else {
		fmt.Println("Order could not be confirmed due to insufficient stock")
	}
}