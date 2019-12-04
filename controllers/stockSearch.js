const axios = require("axios");

/*
  + front-end dynamic ticker input/dropdown
    - using alpha vantage symbol search api function
    - debounced (900ms) user input requests best matches for given input
    - response is array of stocks best matching the given input
    - requests are limited to 5 per minute:
      * if limit reached, response is for front-end to handle approp
      * not reached, stock symbol & company name is extracted 
*/


const url = symbol =>
  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${process.env.APIKEY}`;

module.exports = async (symbol, res) => {
  let bestMatches = axios.get(url(symbol));
  let limitError = { error: "Request limit reached" };
  
  try {
    return await bestMatches
      .then(resp => {
        if (resp.data.Note) {
          return res.status(200).json(limitError);
        }
        
        let matches = resp.data.bestMatches.map(match => ({
          stock: match["1. symbol"],
          name: match["2. name"]
        }))
        
        return res.status(200).json(matches);
      })
      .catch(err => err);
  } catch (err) {
    return err;
  }
};