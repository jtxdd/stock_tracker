/*
  + upsert
    - user searches a stock:
     * if stock exists in db, date is updated
     * not exists in db, ticker & date is inserted to 'Recents' db
  
  + searched
    - for front-end appearance, simulating realistic site function
    - home page shows recently searched tickers with 'time-ago'
    - 10 most recently searched tickers
  
  + ipLikes
    - for front-end appearance...
    - home page shows current ip previous likes if any available
*/

const projection = { _id: 0, stock: 1 };


module.exports = {
  upsert: (symbol, Recents) => {
    const dbUpdate = (stock) => {
      if (/^[a-z]+$/i.test(stock)) {
        Recents.findOneAndUpdate(
          { stock },
          { $set: { date: new Date() } },
          { upsert: true }
        );
      }
    };
    
    if (Array.isArray(symbol)) {
      symbol.forEach(stock => dbUpdate(stock.toUpperCase()));
    } else {
      dbUpdate(symbol.toUpperCase());
    }
  },

  
  searched: Recents =>
    Recents.find(
      {},
      { projection: { ...projection, date: 1 }, sort: { date: -1 }, limit: 10 }
    ).toArray(),

  
  
  ipLikes: (ip, Stocks) =>
    Stocks.find({ likes: { $in: [ip] } }, { projection }).toArray()
};
