import React from "react";
import { DebounceInput } from "react-debounce-input";
import { Link } from 'react-router-dom';

const SymbolInput = props => {
  return (
    <div>
      <small className="form-text text-muted">Enter a ticker symbol</small>
      <div className="input-group">
        <DebounceInput
          debounceTimeout={900}
          id="symbolInput"
          className="form-control"
          type="text"
          placeholder="Symbol"
          name="symbol"
          onChange={props.changeInput}
          value={props.symbol}
          minLength={1}
          maxLength={4}
          required
          autoComplete={"off"}
        />
        <label htmlFor="symbolInput" className="sr-only">
          symbol
        </label>
        <div className="input-group-append">
          <button
            className="fas fa-search btn btn-primary"
            onClick={props.setSymbol}
          >
            <span className="sr-only">search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SymbolSelect = props => {
  const { location: { pathname, search } } = props;
  
  const urlHelper = symbol => {
    let stockLike = props.ipLikes.includes(symbol) ? '&like=true' : '';
    
    if (!props.len) return pathname + '?stock=' + symbol + stockLike;
    
    if (search.includes('like')) {
      return pathname + search.slice(0, search.indexOf('&')) + '&stock=' + symbol + stockLike;
    } else {
      return pathname + search + '&stock=' + symbol;
    }
  };
  
  return (
    <ul className="list-group">
      {props.bestMatches.map(match => (
        <Link
          key={match.stock}
          to={urlHelper(match.stock)}
          onClick={(e) => props.setSymbol(match, e)}
          className="search-match-link"
        >
          <li className="list-group-item d-flex flex-wrap align-items-center">
            <div className="mr-auto">{match.stock}</div>
            <small className="text-muted">{match.name}</small>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export { SymbolInput, SymbolSelect };
