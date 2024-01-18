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
		DbName:     os.Getenv("DB_NAME"),
		DbUser:     os.Getenv("DB_USER"),
		DbPassword: os.Getenv("PASSWORD"),
		DbHost:     os.Getenv("DB_HOST"),
	}

	if viper.Get("DB_NAME") != nil {
		config.DbName = viper.GetString("DB_NAME")
	}
	if viper.Get("DB_USER") != nil {
		config.DbUser = viper.GetString("DB_USER")
	}
	if viper.Get("PASSWORD") != nil {
		config.DbPassword = viper.GetString("PASSWORD")
	}
	if viper.Get("HOST_URL") != nil {
		config.DbHost = viper.GetString("HOST_URL")
	}

	return config
}
