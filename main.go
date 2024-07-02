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
		log.Fatal("Error loading .env file")
	}
}

func getDBConnection() (*sql.DB, error) {
	loadEnv()
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME")))
	if err != nil {
		return nil, err
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
	_, err := db.Exec("UPDATE products SET stock = stock - ? WHERE id = ?", quantity, productID)
	return err
}

func confirmOrder(order Order) (bool, error) {
	db, err := getDBCT