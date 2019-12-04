/*
  + front-end user click checkmark to like/unlike
    - to avoid reaching alpha vantage request limit with get requests
    - if stock(s) liked, update removes ip from stocks likes array
    - not liked, update adds ip to stocks likes array
*/

module.exports = (stock, like, ip, Stocks) => {
  let update = like ? { $pull: { likes: ip } } : { $push: { likes: ip } };

  let options = {
    returnOriginal: false,
    upsert: like ? false : true
  };

  let stocks = Array.isArray(stock) ? stock : [stock];

  return Promise.all(
    stocks.map(stock => Stocks.findOneAndUpdate({ stock }, update, options))
  );
};
