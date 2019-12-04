const axios = require("axios");
const extract = require("./extract");

/*
  + get data
    - requests stock data for the given ticker
    - alpha vantage is the main API, due to favorable response object properties
    - freeCodeCamp API is called when the alpha vantage request limit is reached (5 per minute)
    - response data is appropriated by the extract.js
*/


const url = {
  alpha: symbol =>
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.APIKEY}`,
  fcc: symbol => `https://repeated-alpaca.glitch.me/v1/stock/${symbol}/quote`
};

module.exports = async stock => {
  let alphaData = axios.get(url.alpha(stock));
  let fccData = axios.get(url.fcc(stock));

  try {
    return await alphaData
      .then(res => {
        if (res.data.Note) {
          return fccData.then(fccRes => extract.fcc(fccRes)).catch(err => err);
        }
        return extract.alpha(res);
      })
      .catch(err => err);
  } catch (err) {
    return err;
  }
};
