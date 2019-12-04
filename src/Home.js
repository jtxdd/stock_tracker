import React from "react";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";

const RecentlySearched = props => {
  return (
    <div className="mt-4">
      <h3 className="mb-0">Recently Searched</h3>
      <small className="text-muted lbl-txt">
        Stocks recently searched by others
      </small>
      <div className="row">
        <div className="col">
          {props.recents.map((rec, idx) => (
            <Link
              key={rec.stock + idx}
              to={`/api/stock-prices?stock=${rec.stock}`}
              className="row home-recent-link"
            >
              <div className="col">{rec.stock}</div>
              <TimeAgo className="col text-muted" datetime={rec.date} />
            </Link>
          ))}
        </div>
        <div className="col-3 resp-hide" />
      </div>
    </div>
  );
};

const UserLikes = props => {
  return (
    <div className="mt-4">
      <h3 className="mb-0">Liked Stocks</h3>
      <small className="text-muted lbl-txt">
        Stocks liked on a previous visit
      </small>

      {props.ipLikes.length > 0 ? (
        props.ipLikes.map((like, idx) => (
          <Link
            key={like.stock + idx}
            to={`/api/stock-prices?stock=${like.stock}&like=true`}
            className="row w-50 home-likes-link"
          >
            <div className="col">{like.stock}</div>
          </Link>
        ))
      ) : (
        <div className="font-italic text-muted">No previous likes</div>
      )}
    </div>
  );
};

const Home = props => {
  return (
    <div className="slide-in-left" id="spcl">
      <Link
        to="/api/stock-prices"
        className="btn btn-primary"
        title="Search stocks"
      >
        <span className="fas fa-search mr-1" />
        <span>Stocks</span>
      </Link>

      <div className="row">
        <div className="col-lg-3">
          {props.showLikes && <UserLikes ipLikes={props.ipLikes} />}
        </div>
        <div className="col-lg-9">
          {props.showRecents && <RecentlySearched recents={props.recents} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
