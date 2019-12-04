import React, { Component } from "react";
import axios from "axios";
import Collapse from "react-bootstrap/Collapse";

import * as Search from "./Search";
import StockData from "./StockData";
import Timer from './Timer';

/*    
  -REFACTOR
  
  -test user stories, desktop & mobile
*/

const RequestLoader = props => {
  return props.symbol ? (
    <Collapse in={props.showLoader}>
      <div>
        <ul className="list-group">
          <li className="list-group-item">
            <span className="request-limit">
              <small className="text-muted d-block">
                API limits requests to 5 per minute...
              </small>
              <small>Please wait {props.timerSecs} seconds</small>
            </span>
            <div className="loader">Loading...</div>
          </li>
        </ul>
      </div>
    </Collapse>
  ) : (
    <div className="loader">Loading...</div>
  );
};

const Checkbox = props => {
  const { len, like } = props;
  return (
    <div className="checkbox-container">
      <div>
        <label htmlFor="like-checkbox" className="mr-3 mb-0 checkbox-label">
          Like
        </label>
        <input
          id="like-checkbox"
          name="like"
          type="checkbox"
          checked={like}
          onChange={like ? props.unlikeStock : props.likeStock}
        />
      </div>
      <small className="form-text text-muted">
        {like ? "Uncheck to unlike" : "Check to like"}
      </small>
    </div>
  );
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.timer = React.createRef();

    this.state = {
      bestMatches: [],
      showMatches: false,
      symbol: "",
      stockData: [],
      like: false,
      showLoader: false,
      timerSecs: undefined
    };

    this.changeInput = this.changeInput.bind(this);
    this.searchSymbols = this.searchSymbols.bind(this);
    this.setSymbol = this.setSymbol.bind(this);
    this.removeStock = this.removeStock.bind(this);
    this.unlikeStock = this.unlikeStock.bind(this);
    this.likeStock = this.likeStock.bind(this);
    this.validSearch = this.validSearch.bind(this);
    this.timerReset = this.timerReset.bind(this);
    this.timeRemaining = this.timeRemaining.bind(this);
  }

  componentDidMount() {
    let { location } = this.props;

    if (location.search) {
      let { reqCount } = this.timer.current.state;
      this.timer.current.changeCount(reqCount-1);
      
      this.setState(prev => ({ showLoader: !prev.showLoader }));
      
      let symbol = location.search.split("&")[0].slice(7);
      
      axios
        .get("/api/stock-search?stock=" + symbol)
        .then(res => this.setSymbol(res.data.find(el => el.stock === symbol)))
        .catch(err => console.log("Error: ", err));
    }
  }
  
  changeInput(e) {
    const { value } = e.target;

    if (/^[a-z]+$/i.test(value)) {
      let { reqCount } = this.timer.current.state;
      this.timer.current.changeCount(reqCount-1);
      
      this.searchSymbols(value)
        .then(res => this.setState(prev => Object.assign(prev, res)))
        .catch(err => console.log("Error: ", err));
    } else {
      this.setState(prev => {
        prev.showMatches = false;
        prev.symbol = value.length ? value : "";
        prev.showLoader = false;
        return prev;
      });
    }
  }

  searchSymbols(symbol) {
    return axios
      .get("/api/stock-search?stock=" + symbol)
      .then(res => ({
        symbol,
        bestMatches: Array.isArray(res.data) ? res.data : [],
        showLoader: res.data.hasOwnProperty('error'),
        showMatches: Array.isArray(res.data),
        timerSecs: res.data.hasOwnProperty('error') ? this.timer.current.state.seconds : undefined
      }))
      //.catch(err => console.log("Error: ", err));
      .catch(err => {
        console.log('Error: ', err);
        console.log('err.status: ', err.status);
        /*if (err.status === 502) {
          setTimeout(() => this.searchSymbols(symbol), 500);
        }*/
      });
  }

  setSymbol(symbol, e) {
    if (e) e.preventDefault();
    
    const { location, history } = this.props;
    let { stockData } = this.state;
    let route = location.pathname + "?stock=";
    const LEN = stockData.length;
    
    if (!this.validSearch(symbol)) {
      return this.props.setMessage({
        show: true,
        warning: `${symbol.stock} is below`
      });
    }

    if (LEN) {
      route += stockData[0].stock + "&stock=" + symbol.stock;
    } else {
      route += symbol.stock;
    }
    
    let { reqCount } = this.timer.current.state;
    this.timer.current.changeCount(reqCount-1);

    axios
      .get(location.pathname + "?stock=" + symbol.stock)
      .then(res => {
        let stockA = {}, stockB = res.data.stockData;
        
        stockB.name = symbol.name;

        if (LEN) {
          stockA = stockData[0];
          stockA.rel_likes = stockA.likes - stockB.likes;
          
          stockB.rel_likes = stockB.likes - stockA.likes;

          route += stockA.ipLiked && stockB.ipLiked ? '&like=true' : '';
        } else {
          route += stockB.ipLiked ? '&like=true' : '';
        }

        this.setState(prev => {
          prev.like = LEN ? stockA.ipLiked && stockB.ipLiked : stockB.ipLiked;
          prev.stockData = LEN ? [stockA, stockB] : [stockB];
          prev.symbol = "";
          prev.bestMatches = [];
          prev.showLoader = false;
          prev.showMatches = false;
          return prev;
        });

        history.push(route);
      })
      .catch(err => console.log("Error: ", err));
  }
  
  validSearch(symbol) {
    let { stockData } = this.state;
    
    if (stockData.some(el => el.stock === symbol.stock)) {
      this.setState(prev => {
        prev.bestMatches = [];
        prev.symbol = "";
        prev.showLoader = false;
        prev.showMatches = false;
        return prev;
      });
      
      return false;
    }
    return true;
  }

  removeStock(symbol) {
    const { location, history } = this.props;

    let route = location.pathname;
    let stockData = this.state.stockData.filter(
      stock => stock.stock !== symbol
    );

    if (stockData.length) {
      delete stockData[0].rel_likes;
      route += `?stock=${stockData[0].stock}${
        stockData[0].ipLiked ? "&like=true" : ""
      }`;
    }

    this.setState(prev => {
      prev.stockData = stockData;
      prev.like = stockData.length ? stockData[0].ipLiked : false;
      return prev;
    });

    history.push(route);
  }

  unlikeStock(e) {
    const { location, history } = this.props;
    let { stockData } = this.state;

    axios
      .put(location.pathname + location.search)
      .then(res => {
        stockData.forEach(stock => {
          stock.ipLiked = false;
          stock.likes -= 1;
        });

        if (stockData.length > 1) {
          stockData[0].rel_likes = stockData[0].likes - stockData[1].likes;
          stockData[1].rel_likes = stockData[1].likes - stockData[0].likes;
        }

        this.setState(prev => {
          prev.stockData = stockData;
          prev.like = false;
          return prev;
        });

        history.push(location.pathname + location.search.slice(0, -10));
        this.props.setMessage(res.data);
      })
      .catch(err => console.log("Error: ", err));
  }

  likeStock(e) {
    const { location, history } = this.props;
    let { stockData } = this.state;

    let unlikedStocks = stockData.filter(el => !el.ipLiked);
    let routes = unlikedStocks.map((el, i) =>
      axios.put(location.pathname + "?stock=" + el.stock)
    );

    axios
      .all(routes)
      .then(
        axios.spread((stock1, stock2) => {
          let unlikedSymbols = unlikedStocks.map(el => el.stock);
          let fail = { show: true, danger: "Something happened, try again" };

          stockData.forEach(stock => {
            if (unlikedSymbols.includes(stock.stock)) {
              stock.likes += 1;
              stock.ipLiked = true;
            }
          });

          if (stockData.length > 1) {
            stockData[0].rel_likes = stockData[0].likes - stockData[1].likes;
            stockData[1].rel_likes = stockData[1].likes - stockData[0].likes;
          }

          this.setState(prev => {
            prev.stockData = stockData;
            prev.like = true;
            return prev;
          });

          history.push(location.pathname + location.search + "&like=true");

          if (unlikedStocks.length > 1) {
            if (stock1.data.success && stock2.data.success) {
              return this.props.setMessage(stock1.data);
            } else {
              return this.props.setMessage(fail);
            }
          } else {
            stock1.data.success
              ? this.props.setMessage(stock1.data)
              : this.props.setMessage(fail);
          }
        })
      )
      .catch(err => console.log("Error: ", err));
  }

  timerReset() {
    const { symbol, showLoader } = this.state;
    
    if (showLoader) {
      let { reqCount } = this.timer.current.state;
      this.timer.current.changeCount(reqCount-1);
      
      this.searchSymbols(symbol)
        .then(res => this.setState(prev => Object.assign(prev, res)))
        .catch(err => console.log("Error: ", err));
    }
  }
  
  timeRemaining(seconds) {
    this.setState(prev => {
      prev.timerSecs = seconds;
      return prev;
    });
  }
  
  render() {
    const {
      bestMatches,
      showMatches,
      symbol,
      stockData,
      like,
      showLoader,
      timerSecs
    } = this.state;    
    return (
      <div className="slide-in">
        <h1 className="fade-in">
          {stockData.length > 1 ? "Compare" : "Search"}
        </h1>

        {stockData.length < 2 && (
          <div className="search-with-matches">
            <Search.SymbolInput
              symbol={symbol}
              changeInput={this.changeInput}
              setSymbol={this.setSymbol}
            />
          
              <div className="collapse-with-matches">
                {showLoader ? (
                  <RequestLoader 
                    showLoader={showLoader} 
                    symbol={symbol} 
                    timerSecs={timerSecs} 
                  />
                ) : (
                  <Collapse in={showMatches}>
                    <div>
                      <Search.SymbolSelect
                        bestMatches={bestMatches}
                        setSymbol={this.setSymbol}
                        symbol={symbol}
                        len={stockData.length}
                        ipLikes={this.props.ipLikes.map(el => el.symbol)}
                        location={this.props.location}
                      />
                    </div>
                  </Collapse>
                )}
              </div>
          </div>
        )}
        
        <Collapse in={!showMatches}>
          <div className={!showMatches ? 'fade-in' : 'fade-out'}>
            <div className="row ml-0">
              {stockData.map((data, index) => (
                <div key={`stockData${index}`} className="col-sm-6">
                  <StockData
                    stockData={data}
                    removeStock={this.removeStock}
                  />
                </div>
              ))}
            </div>

            {stockData.length > 0 && (
              <Checkbox
                len={stockData.length}
                like={like}
                unlikeStock={this.unlikeStock}
                likeStock={this.likeStock}
              />
            )}
          </div>
        </Collapse>
        
        <Timer 
          ref={this.timer}
          showLoader={showLoader}
          timerReset={this.timerReset} 
          timeRemaining={this.timeRemaining}
        />
      </div>
    );
  }
}

export default Dashboard;