import React from "react";

const helper = {
  textColor: val => val.startsWith("-") ? "text-danger" : "text-success",
  
  upOrDown: up => `fas fa-caret-${up ? "up text-success" : "down text-danger"}`,
  
  changePercent: val =>
    isNaN(val) ? Number(val.slice(0, -1)).toFixed(2) : Number(val).toFixed(2),
    
  relColor: rel_likes =>
    rel_likes < 0 ? "danger" : rel_likes > 0 ? "success" : "warning",

  dateFormat: d => ({
    full: new Date(d).toLocaleString({}, { dateStyle: "full" }),
    short: new Date(d).toLocaleString({}, { dateStyle: "short" })
  }),

  abbrevNum: num => {
    const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
    let tier = (Math.log10(num) / 3) | 0;

    if (tier == 0) return num;

    return (num / Math.pow(10, tier * 3)).toFixed(2) + SI_SYMBOL[tier];
  }
};

const StockHeader = props => {
  return (
    <div className="row border-bottom border-dark">
      <div className="col d-flex flex-wrap">
        <div className="mr-3 d-flex flex-wrap align-items-center">
          <button
            className="fas fa-times btn btn-sm btn-danger mr-1"
            title="Remove"
            onClick={() => props.removeStock(props.symbol)}
          >
            <span className="sr-only">Remove</span>
          </button>
          <span className="stock-symbol">{props.symbol}</span>
        </div>
        <div className="mr-3 align-self-center">
          <small className="stock-name">{props.name}</small>
        </div>
      </div>
    </div>
  );
};

const PriceAndChange = props => {
  return (
    <div className="row mb-1">
      <div className="col d-flex flex-wrap">
        <div className="mr-3">
          <span className={props.upDown_icon} />
          <span className="stock-price">{props.price}</span>
        </div>
        <div className="d-flex flex-wrap align-self-center">
          <div className="mr-3">
            <span className={props.upDown_color}>
              <span className="stock-change">{props.change}</span>
            </span>
          </div>
          <div>
            <span className={props.upDown_color}>
              <span className="stock-change-percent">
                {props.changePercent}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OpenAndClose = props => {
  return(
    <div>
      <div className="row">
        <div className="col flex-grow-0">
          <small className="text-muted">Prev:</small>
        </div>
        <div className="col stock-prev">{props.prev}</div>
      </div>
      <div className="row">
        <div className="col flex-grow-0">
          <small className="text-muted">Open:</small>
        </div>
        <div className="col stock-open">{props.open}</div>
      </div>
    </div>
  );
};

const HighAndLow = props => {
  return(
    <div>
      <div className="row">
        <div className="col flex-grow-0">
          <small className="text-muted">Low:</small>
        </div>
        <div className="col stock-high">{props.low}</div>
      </div>
      <div className="row">
        <div className="col flex-grow-0">
          <small className="text-muted">High:</small>
        </div>
        <div className="col stock-low">{props.high}</div>
      </div>
    </div>
  );
};

const StockVolume = props => {
  return(
    <div>
      <div className="row">
        <div className="col flex-grow-0">
          <small className="text-muted">Vol:</small>
        </div>
        <div className="col stock-volume">{props.volume}</div>
      </div>
    </div>
  );
};

const Likes = props => {
  return(
    <div className="border-top border-dark" style={{marginLeft: '-15px', marginRight: '-15px'}}>
      <div style={{marginLeft: '15px'}}>Likes</div>
      <div className="row ml-0">
        <div className="col flex-grow-0">
          <small className="text-muted">Total:</small>
        </div>
        <div className="col stock-likes">{props.likes}</div>
      </div>
      <div className="row ml-0">
        <div className="col flex-grow-0">
          <small className="text-muted">
            {props.showRel ? "Relative:" : ""}
          </small>
        </div>
        <div className="col stock-rel-likes">
          <span className={"badge badge-" + helper.relColor(props.rel_likes)}>
            {props.rel_likes > 0 ? "+" + props.rel_likes : props.rel_likes}
          </span>
        </div>
      </div>
    </div>
  );
};

const StockData = props => {
  const { stockData } = props;
  const latest = helper.dateFormat(stockData.latest_trading_day);
  return (
    <div className="row mt-3 mr-1 fade-in stock-bg w-75">
      <div className="col border border-dark">
        <StockHeader
          symbol={stockData.stock.toUpperCase()}
          name={stockData.name}
          removeStock={props.removeStock}
        />
        <div>
          <small className="stock-latest-date" title={latest.full}>
            {latest.short}
          </small>
        </div>
        <PriceAndChange
          upDown_icon={helper.upOrDown(
            stockData.price > stockData.previous_close
          )}
          upDown_color={helper.textColor(stockData.change_percent.toString())}
          price={Number(stockData.price).toFixed(2)}
          change={Number(stockData.change).toFixed(2)}
          changePercent={helper.changePercent(stockData.change_percent) + "%"}
        />
        <OpenAndClose
          open={Number(stockData.open).toFixed(2)}
          prev={Number(stockData.previous_close).toFixed(2)}
        />
        <HighAndLow
          high={Number(stockData.high).toFixed(2)}
          low={Number(stockData.low).toFixed(2)}
        />
        <StockVolume
          volume={helper.abbrevNum(stockData.volume)}
        />
        <Likes
          likes={stockData.likes}
          rel_likes={
            stockData.hasOwnProperty("rel_likes") ? stockData.rel_likes : ""
          }
          showRel={stockData.hasOwnProperty("rel_likes")}
        />
      </div>
    </div>
  );
};

export default StockData;