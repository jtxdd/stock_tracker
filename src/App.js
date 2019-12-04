import React, { Component } from "react";
import { Switch, Route, withRouter, Link } from "react-router-dom";
import axios from "axios";
import Collapse from "react-bootstrap/Collapse";
import Alert from "react-bootstrap/Alert";

import Home from "./Home";
import Dashboard from "./Dashboard";
import "./style.scss";

const Notify = props => {
  const { show, ...alertType } = props.message;
  const alertKey = Object.keys(alertType)[0];
  return (
    <Collapse in={show}>
      <div>
        <Alert variant={alertKey} dismissible onClose={props.setMessage}>
          {alertType[alertKey]}
        </Alert>
      </div>
    </Collapse>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: {},
      recents: [],
      ipLikes: [],
      showRecents: false,
      showLikes: false
    };

    this.setMessage = this.setMessage.bind(this);
    this.getRecents = this.getRecents.bind(this);
  }

  componentDidMount() {
    this.getRecents();
  }
  
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    
    if (location !== prevProps.location) {
      if (location.search.includes('?stock=')) {
        this.getRecents();
      }
    }
  }
  
  getRecents() {
    axios
      .get("/api/stock-recents")
      .then(res => this.setState({
        showRecents: true,
        showLikes: true,
        recents: res.data.recents, 
        ipLikes: res.data.ipLikes
      }))
      .catch(err => console.log('Error: ', err));
  }

  setMessage(message) {
    let mssg = this.state.message;
    mssg.show = false;

    this.setState(prev => {
      prev.message = message ? message : mssg;
      return prev;
    });
    
    if (message.success) {
      this.getRecents();
    }
  }

  render() {
    const { message, recents, showRecents, ipLikes, showLikes } = this.state;
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <Link to="/" className="navbar-brand">
            Stock Tracker
          </Link>
        </nav>

        <Notify message={message} setMessage={this.setMessage} />
        <main className="main-container">
          <Switch>
            <Route
              exact
              path="/"
              render={props => 
                <Home 
                  {...props} 
                  recents={recents} 
                  ipLikes={ipLikes}
                  showLikes={showLikes}
                  showRecents={showRecents} 
                />}
            />
            <Route
              path="/api/stock-prices"
              render={props => (
                <Dashboard 
                  {...props} 
                  setMessage={this.setMessage} 
                  ipLikes={ipLikes}
                />
              )}
            />
          </Switch>
        </main>

        <footer className="bg-dark">
          <div>Stock Tracker</div>
        </footer>
      </div>
    );
  }
}

export default withRouter(App);