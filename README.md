# User Stories
1. Set the CSP to only allow scripts & CSS from your server.  
2. Request __*/api/stock-prices*__ with ticker & response is an object *stockData*.  
3. *stockData* properties: *stock* (ticker string), *price* (decimal string), & *likes* (int).  
4. Request with *like=true* increments *likes* value for that stock, 1 like per IP.  
5. Request with 2 stocks returns an array of both stockData objects;  
*likes* property is replaced with *rel_likes* (the difference between the likes).  
6. All 5 functional tests are complete and passing.

<hr>  

/api/stock-recents - GET  
returns array of recently searched tickers  
returns array of tickers current IP has previously liked

/api/stock-search - GET  
*uses [Alpha Vantage API](https://www.alphavantage.co/documentation/#symbolsearch)* - *5 requests per minute*  
returns array of best matched stocks based on user ticker input  

/api/stock-prices?stock= - GET  
*uses [Alpha Vantage API](https://www.alphavantage.co/documentation/#symbolsearch)* - *5 requests per minute*  
*uses [fCC API](https://repeated-alpaca.glitch.me/) as backup*  
1 stock returns *stockData* object:  
&emsp;`stock: ticker string,`   
&emsp;`open: decimal string,`   
&emsp;`high: decimal string,`    
&emsp;`low: decimal string,`  
&emsp;`price: decimal string,`  
&emsp;`change: decimal string,`  
&emsp;`likes: int,`  
&emsp;`volume: num string,`  
&emsp;`ipLiked: boolean`  
&emsp;`latest_trading-day: date string,`  
&emsp;`previous close: decimal string,`    
&emsp;`change_percent: decimal % string,`  
2 stock returns array of *stockData* objects; *likes* is replaced with *rel_likes* (int)

<hr>

### Ex. 1 stock:  
__*request*__   
/api/stock-prices?stock=GOOG  

__*response*__  
{  
&emsp;stockData:  
&emsp;&emsp;{ stock: "GOOG", price: "786.90", likes: 1 }  
}   

<hr>

### Ex. 2 stock:  
__*request*__   
/api/stock-prices?stock=GOOG&stock=MSFT

__*response*__  
{  
&emsp;stockData: [  
&emsp;&emsp;{ stock: "MSFT", price: "62.30", rel_likes: -1 },  
&emsp;&emsp;{ stock: "GOOG", price: "786.90", rel_likes: 1 }  
&emsp;]  
}