## Ansybl CLI

This CLI tool is intended to make the lives of validator node operators easier

### Dependencies

- [`go`](https://go.dev/doc/install)
- [`crontab`](https://www.adminschoice.com/crontab-quick-reference)
### Functionality

1) Monitoring and alerting on validator downtime via PagerDuty

### Supported chains

1) Canto

### Install

1) `git clone https://github.com/ansybl/ansybl.git`
2) `cd ansybl`
3) `go build`
4) `chmod +x ansybl`
5) `sudo mv ansybl /usr/bin/`

### Initialize

The `ansybl` binary should be available via the terminal to execute

1) `ansyble init`
2) Follow the promts and iInput your PagerDuty service ID, email and API key.

**Your service ID is typically a 7 character string that can be found in the url when you navigate to your services page.

If the test alert was successful proceed to cron setup

### Cron Setup

1) `crontab -e`
2) Add a newline and insert the following

`*/1 * * * * ansybl monitor`

This will trigger a missing blocks check every minute

### Roadmap

1) Automate the cron setup
2) Gravity Bridge support
3) Easily claim and restake commissions with one command
