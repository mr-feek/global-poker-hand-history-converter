# global-poker-hand-history-converter
Convert Global Poker hand histories to PokerStars format.  To download these histories from global poker, use [this chrome extension](https://github.com/mr-feek/global-poker-hand-history-converter-chrome-extension)

*This package is a work in progress. It currently only supports converting cash games.*

 The goal of this repo is to be able to convert Global Poker hand histories into the format used by PokerStars. This enables the importing of Global Poker hand histories into the likes of PokerTracker 4 to analyze **your own results**. This package is **not meant** to be used to power a HUD or to gain real time stats on other players.

 
 
 ## Install
 `npm install @mr-feek/global-poker-hand-history-converter`
 
 ## Usage
 ```javascript
 import { convertHand } from './src/Converter';
 import GlobalPokerHand from './src/GlobalPokerHand';
 
 // fetch your JSON blob of hand history from global poker API (outside the scope of this package)
 const handHistoryBlob = {};
 const globalPokerHand = new GlobalPokerHand(handHistoryBlob);
 const pokerStarsFormat = convertHand(globalPokerHand);
 ```
 ## Development
 ### Setup
 - `yarn install`
## Running Tests
`npm run test`
