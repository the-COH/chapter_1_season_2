# Canto Crabs Submission for the Hackathon

## Canto Crabs Present the First Fully On-Chain Roulette Game

![Roulette Game UI](https://files.catbox.moe/gxnz90.JPG)

Canto Crabs Casino currently presents the roulette game as a submission for the hackathon. This is a conversion of the classic casino game into the blockchain world.

- A Player can connect with their wallet
- A Player can select any number for betting
- A Player can select any column for betting
- A Player can select any row for betting
- A Player can select any color for betting
- A Player can select even/odd for betting

**DEV NOTES**

- Due to the scope of the hackathon and missing of solid on-chain VRF (Maybe something to build for ourselves in the future!), randomness is calculated in the transaction itself.

- Payout Odds are directly based on the probability of the outcome. The odds are visible on the front-end as the number of slots on the roulette wheel

- The app is made to show the viability of the concept. Security, and privacy haven't been prioritized for the purpose of this hackathon. The final product will be refined for all of these criteria

- Due to some troubles with the Canto Testnet RPC(?) the spinning part of the animation wheel has a bug in its working. The BSC Testnet version of the app works perfectly and smoothly with the animation. (This bug/error is something we will discuss with the Canto team for proper guidance)

- With the randomness being calculated in the transaction itself, it opens up the game for exploits. This will be reviewed and optimized for the full release.

- UI is served to function as MVP for the whole game. Improvements and refinements in both the looks and code will be made before the full release

- For purpose of the hackathon, randomness is used in tandem with the odds of the betting choice to calculate the final result. Singular number picking will be utilized with a proper VRF tool in the full release

## Current Features

**Contract Summary**

- The whole game is packed into a singular and atomized contract for maximum modularity and integrations with the Crab Casino

- Helper contracts are only used for the purposes of Authentication/Ownership as well as for mathematical functions

- Roulette Contract has all the functionality necessary for the roulette game to function including all the calculation functions and betting mechanisms

- The first part of the Contract deals with calculator functions related to the singular number roulette version

- The second part of the Contract is the random number generator function which is a crude and rudimentary function for the purpose of the hackathon

- The third part consists of the basic variables and set up for the roulette contract including odds for the various options available

- The fourth part of the contract is the main function required for placing the bets. Depending upon the type of bet, odds are used for the purpose of calculating the win based on the randomness generated in the second part.

- The house currently gets a payout tax of 5% on all the games depending upon the bet result

**UI Summary**

- The frontend is made with ReactJS along with useDApp and ethers for the smart contract/blockchain functionalities and state mutations

- The roulette wheel is a custom react component that updates based on the results fetched from the on-chain game

- The neon aesthetics are used on the board to blend in with the background and the whole Canto vibe

- The wheel is updated based on the odds of the choice that the player has decided to roll on

- The rows of numbers is highlighted purely on the basis of what the user has selected as their option

- Transition effects are added to the UI to make it more organic and playful for the player

## Future Plans

- Singular number roulette on-chain with all proper functionalities

- Integration of fee reduction exclusive for Canto Crabs NFT Holders

- Refining and refactoring the smart contract code

- Release of Canto Crabs NFT Contract

- Integration of on-chain Canto VRF solutions into the casino to make the game even more fair and random

- Audits for all the smart contracts involved in the Crab Casino

- Improvement of Frontend design and UI with an even more sleeker theme and responsiveness

- Addition of auditory effects for maximum engagement and enjoyment in the casino

- More games like slots and other casino games added to the Crab Casino

![Crabs Sneak Peek](https://files.catbox.moe/8flj1s.gif)

Our Website: https://cantocrabs.com/

Our Twitter: https://twitter.com/CantoCrabs

Test DApp: [BSC Testnet - Spin On](https://cantocrabstest.surge.sh/) | [Canto Testnet - Spin Off](https://cantocrabstestcanto.surge.sh/)
