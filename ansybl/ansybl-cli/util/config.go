package util

import "github.com/spf13/viper"

type Config struct {
	PD_SERVICE_ID     string `mapstructure:"PD_SERVICE_ID"`
	PD_EMAIL          string `mapstructure:"PD_EMAIL"`
	PD_API_KEY        string `mapstructure:"PD_API_KEY"`
	CONSENSUS_ADDRESS string `mapstructure:"CONSENSUS_ADDRESS"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
