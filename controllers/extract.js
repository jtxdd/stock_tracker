/*
  + extract data
    - extracts the required properties from the response stock data object
    - transforms response stock data object to more approptiate property names
    - alpha = alpha vantage API, fcc = freeCodeCamp API
*/

module.exports = {
  alpha: el => {
    let stockData = {};

    Object.entries(el.data["Global Quote"]).forEach(pair => {
      let key = pair[0]
        .split(" ")
        .slice(1)
        .join("_");

      let val = pair[1];

      if (key === "symbol") {
        stockData.stock = val;
      } else {
        stockData[key] = val;
      }
    });

    return stockData;
  },

  fcc: el => {
    return {
      change_percent: el.data.changePercent,
      previous_close: el.data.previousClose,
      price: el.data.latestPrice,
      stock: el.data.symbol,
      latest_trading_day: new Date(el.data.latestUpdate)
        .toISOString()
        .split("T")[0],
      change: el.data.change,
      open: el.data.open,
      high: el.data.high,
      low: el.data.low,
      volume: el.data.volume
    };
  }
};