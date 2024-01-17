package main

import (
	"fmt"

	"github.com/kousheralam/stats-worker/database"
)

func main() {
	fmt.Println("Background worker lunched!")
	database.GetMongoClient("localhost:27017", "user", "password", "users")
	// client.Database("users").Collection("users").InsertOne(context.Background(), bson.M{"name": "kousher", "age": 22})
}
