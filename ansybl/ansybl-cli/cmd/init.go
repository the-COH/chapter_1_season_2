/*
Copyright © 2022 Brian <brian@ansybl.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
package cmd

import (
	"fmt"
	"log"
	"os/exec"
	"strings"

	"github.com/PagerDuty/go-pagerduty"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize Ansybl by answering a series of questions to get started.",
	Long: `Enter the following information so we can alert you via PagerDuty when your validator is missing blocks.
	
	1) PagerDuty service ID
	2) PagerDuty email address
	3) PagerDuty API token`,
	Run: func(cmd *cobra.Command, args []string) {
		var pd_service_id string
		var pd_email string
		var pd_api_key string
		var consensus_address string

		consensus_address = get_consensus_address()

		fmt.Println("Enter your PagerDuty service ID:")
		fmt.Scanln(&pd_service_id)

		fmt.Println("Enter your email that's associated with your PagerDuty account:")
		fmt.Scanln(&pd_email)

		fmt.Println("Enter your PagerDuty API token:")
		fmt.Scanln(&pd_api_key)

		fmt.Println("Press enter to send a test alert.")
		fmt.Scanln()

		viper.Set("PD_SERVICE_ID", pd_service_id)
		viper.Set("PD_EMAIL", pd_email)
		viper.Set("PD_API_KEY", pd_api_key)
		viper.Set("CONSENSUS_ADDRESS", consensus_address)
		viper.WriteConfigAs("app.env")

		trigger_alarm(pd_service_id, pd_email, pd_api_key)

		fmt.Println("Test alert sent!")
		fmt.Println("If an alert got triggered, setup is complete.")
		fmt.Println("If you did not see an alert come through, please try again.")
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}

func trigger_alarm(service_id string, email string, authtoken string) {

	client := pagerduty.NewClient(authtoken)
	service := pagerduty.APIReference{
		ID:   service_id,
		Type: "service_reference",
	}
	body := pagerduty.APIDetails{
		Type:    "incident_body",
		Details: "Canto node is missing blocks!",
	}
	incident := pagerduty.CreateIncidentOptions{
		Type:    "incident",
		Title:   "Canto node is missing blocks",
		Service: &service,
		Body:    &body,
	}

	resp, err := client.CreateIncident(email, &incident)
	if err != nil || resp == nil {
		panic(err)
	}
}

func get_consensus_address() string {
	arg0 := "tendermint"
	arg1 := "show-address"
	out, err := exec.Command("cantod", arg0, arg1).Output()

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Retrieved and set consensus address to ", string(out))
	address := string(out)
	return strings.TrimSpace(address)
}
