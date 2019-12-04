const axios = require("axios");
const getData = require("./getData");

/*
  + db stock
    - check if stock is in db
    - return likes.length & see if user ip is in the likes array
  
  + db stock with like
    - request with like in the query (?stock=goog&like=true)
    - mongoDb upsert operation using $addToSet operator
    - $addToSet only adds value to array if value is not already present
    
  - stock data API request is invoked
  - the db results are merged with the stock data response
*/

module.exports = async (stock, like, ip, Stocks) => {
  stock = stock.toUpperCase();

  let update = { $addToSet: { likes: ip } };
  let options = { returnOriginal: false, upsert: true };

  let dbData = like
    ? Stocks.findOneAndUpdate({ stock }, update, options)
    : Stocks.findOne({ stock });
  
  let apiData = getData(stock);

  try {
    return await Promise.all([dbData, apiData])
      .then(data => ({
        stockData: {
          ...data[1],
          likes: like
            ? data[0].value.likes.length
            : data[0]
            ? data[0].likes.length
            : 0,
          ipLiked: like
            ? data[0].value.likes.includes(ip)
            : data[0]
            ? data[0].likes.includes(ip)
            : false
        }
      }))
      .catch(err => err);
  } catch (err) {
    return err;
  }
};
