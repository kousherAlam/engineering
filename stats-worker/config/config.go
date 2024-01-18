package config

import (
	"os"

	"github.com/spf13/viper"
)

type AppConfig struct {
	DbName     string
	DbUser     string
	DbPassword string
	DbHost     string
}

func GetConfig() AppConfig {
	viper.SetConfigType("env")
	viper.SetConfigName(".env")

	viper.AddConfigPath("../")
	viper.AddConfigPath(".")
	viper.ReadInConfig()

	var config = AppConfig{
		DbName:     os.Getenv("MONGODB_DBNAME"),
		DbUser:     os.Getenv("MONGODB_USER"),
		DbPassword: os.Getenv("MONGODB_PASSWORD"),
		DbHost:     os.Getenv("MONGODB_HOST"),
	}

	if viper.Get("MONGODB_DBNAME") != nil {
		config.DbName = viper.GetString("MONGODB_DBNAME")
	}
	if viper.Get("MONGODB_USER") != nil {
		config.DbUser = viper.GetString("MONGODB_USER")
	}
	if viper.Get("MONGODB_PASSWORD") != nil {
		config.DbPassword = viper.GetString("MONGODB_PASSWORD")
	}
	if viper.Get("MONGODB_HOST") != nil {
		config.DbHost = viper.GetString("MONGODB_HOST")
	}

	return config
}
