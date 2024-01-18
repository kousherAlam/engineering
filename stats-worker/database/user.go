package database

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id     primitive.ObjectID `bson:"_id,omitempty"`
	Name   string             `bson:"name,omitempty"`
	Email  string             `bson:"email,omitempty"`
	UserID string             `bson:"userID,omitempty"`
}

func (user *User) Log() string {
	return fmt.Sprintf("%10s \t %s", user.Name, user.Email)
}
