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
	"encoding/json"
	"fmt"
	"log"
	"os/exec"
	"strconv"

	"github.com/ansybl/ansybl/util"
	"github.com/spf13/cobra"
)

type Pagination struct {
	NextKey string `json:"next_key"`
	Total   string `json:"total"`
}
type AddressInfo struct {
	Address             string `json:"address"`
	StartHeight         string `json:"start_height"`
	IndexOffset         string `json:"index_offset"`
	JailedUntil         string `json:"jailed_until"`
	Tomstoned           bool   `json:"tomstoned"`
	MissedBlocksCounter string `json:"missed_blocks_counter"`
}
type SlashingInfo struct {
	Info       []AddressInfo `json:"info"`
	Pagination Pagination    `json:"pagination"`
}

var monitorCmd = &cobra.Command{
	Use:   "monitor",
	Short: "Checks for missed blocks",
	Long: `This command checks if the validator running on this machine has missed signing any blocks. 
	If it has missed blocks it will trigger a PagerDuty alert.`,
	Run: func(cmd *cobra.Command, args []string) {
		config, err := util.LoadConfig(".")
		if err != nil {
			log.Fatal("cannot load config: ", err)
			log.Fatal("Make sure you run init before monitor")
		}

		info := get_signing_info()
		var slashing_info SlashingInfo
		err = json.Unmarshal(info, &slashing_info)
		if err != nil {
			log.Fatal(err)
		}

		for _, elem := range slashing_info.Info {
			if elem.Address == config.CONSENSUS_ADDRESS {
				blocks_missed, err := strconv.Atoi(elem.MissedBlocksCounter)
				if err != nil {
					log.Fatal(err)
				}
				if blocks_missed > 0 {
					trigger_alarm(config.PD_SERVICE_ID, config.PD_EMAIL, config.PD_API_KEY)
				} else {
					fmt.Println("🎉 Validator has not missed signing any blocks! 🎉")
				}
			}
		}
	},
}

func init() {
	rootCmd.AddCommand(monitorCmd)
}

func get_signing_info() []byte {
	arg0 := "query"
	arg1 := "slashing"
	arg2 := "signing-infos"
	arg3 := "--limit"
	arg4 := "200"
	arg5 := "--output"
	arg6 := "json"
	out, err := exec.Command("cantod", arg0, arg1, arg2, arg3, arg4, arg5, arg6).Output()

	if err != nil {
		log.Fatal(err)
	}
	return out
}
