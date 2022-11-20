/*
Copyright © 2022 Brian <brian@ansybl.io>
*/
package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "ansybl",
	Short: "An open source proof-of-stake validator utility package",
	Long: `

     _____                        ___.   .__   
    /  _  \   ____   _________.__.\_ |__ |  |  
   /  /_\  \ /    \ /  ___<   |  | | __ \|  |  
  /    |    \   |  \\___ \ \___  | | \_\ \  |__
  \____|__  /___|  /____  >/ ____| |___  /____/
          \/     \/     \/ \/          \/      

Welcome to Ansybl! This CLI tool currently has one main function.

1) Monitor for Canto validator uptime and alert via PagerDuty on missing blocks

To get started type 'ansybl init'
 `,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
