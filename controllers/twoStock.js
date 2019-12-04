const oneStock = require("./oneStock");

/*
  + query with 2 stock params
    - maps each stock to oneStock.js
    - adds the 'rel_likes' property to each stockData object
    - transform response data to meet requirements:
      * stockData obj with array value containing each stocks own stockData obj
*/


module.exports = async (symbol, like, ip, Stocks) => {
  let bothStocks = Promise.all(
    symbol.map(stock => oneStock(stock, like, ip, Stocks))
  );

  try {
    return await bothStocks
      .then(data => {
        let { likes: likes1, ...stock1 } = data[0].stockData;
        let { likes: likes2, ...stock2 } = data[1].stockData;

        stock1.rel_likes = likes1 - likes2;
        stock2.rel_likes = likes2 - likes1;

        return { stockData: [stock1, stock2] };
      })
      .catch(err => err);
  } catch (err) {
    return err;
  }
};