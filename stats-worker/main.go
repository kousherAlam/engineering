package main

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/kousheralam/stats-worker/config"
	"github.com/kousheralam/stats-worker/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	fmt.Println("Background worker lunched!")
	env := config.GetConfig()
	dbCtx := context.Background()
	uri := fmt.Sprintf("mongodb://%s:%s@%s/?retryWrites=true&w=majority", env.DbUser, env.DbPassword, env.DbHost)
	var prevCount uint64
	client := database.GetMongoClient(dbCtx, uri)

	defer func() {
		if err := client.Disconnect(dbCtx); err != nil {
			panic(err)
		}
	}()

	tick := time.Tick(10 * time.Second)

	for {
		userCol := client.Database(env.DbName).Collection("users")
		statsCol := client.Database(env.DbName).Collection("stats")

		cursor, err := userCol.Find(dbCtx, bson.M{})
		if err != nil {
			panic(err)
		}
		var users []database.User
		if err = cursor.All(dbCtx, &users); err != nil {
			panic(err)
		}
		wg := sync.WaitGroup{}

		wg.Add(1)
		go showStatus(users, &wg)
		if prevCount != uint64(len(users)) {
			wg.Add(1)
			prevCount = uint64(len(users))
			go insertStatus(statsCol, uint64(len(users)), &wg)
		}
		wg.Wait()
		<-tick
	}

}

func showStatus(users []database.User, wg *sync.WaitGroup) {
	fmt.Println("\n====================================")
	fmt.Println("Users in the database:", len(users))
	for _, user := range users {
		fmt.Println(user.Log())
	}
	wg.Done()
}

func insertStatus(statsCol *mongo.Collection, count uint64, wg *sync.WaitGroup) {
	fmt.Printf("Updating stats table as user count change\n")
	cursor, err := statsCol.InsertOne(context.Background(), bson.M{"count": count, "time": time.Now().UTC(), "type": "user"})
	if err != nil {
		fmt.Printf("%s\n", err)
	}
	fmt.Printf("InsertID = %s\n", cursor.InsertedID)
	wg.Done()
}
