package main

import (
	"context"
	"fmt"
	"time"

	"github.com/kousheralam/stats-worker/config"
	"github.com/kousheralam/stats-worker/database"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	fmt.Println("Background worker lunched!")
	env := config.GetConfig()
	dbCtx := context.Background()
	uri := fmt.Sprintf("mongodb://%s:%s@%s/?retryWrites=true&w=majority", env.DbUser, env.DbPassword, env.DbHost)

	client := database.GetMongoClient(dbCtx, uri)

	defer func() {
		if err := client.Disconnect(dbCtx); err != nil {
			panic(err)
		}
	}()

	tick := time.Tick(10 * time.Second)

	for {
		userCol := client.Database(env.DbName).Collection("users")
		cursor, err := userCol.Find(dbCtx, bson.M{})
		if err != nil {
			panic(err)
		}
		var users []database.User
		if err = cursor.All(dbCtx, &users); err != nil {
			panic(err)
		}
		fmt.Println("\n====================================")
		fmt.Println("Users in the database:", len(users))
		for _, user := range users {
			fmt.Println(user.Log())
		}
		<-tick
	}

}
