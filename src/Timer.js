import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      reqCount: 5,
      seconds: 60,
      timerId: null,
      running: false,
      started: null
    };
    
    this.handleTick = this.handleTick.bind(this);
    this.changeCount = this.changeCount.bind(this);
  }
  
  changeCount(reqCount) {
    if (this.state.running) {
      this.setState(prev => {
        prev.reqCount = reqCount > 0 ? reqCount : 0;
        return prev;
      });
    } else {
      this.setState(prev => {
        prev.reqCount = reqCount > 0 ? reqCount : 0;
        prev.running = true;
        prev.timerId = setInterval(this.handleTick, 1000);
        prev.started = Date.now();
        return prev;
      });
    }
  }
  
  handleTick() {
    const { reqCount, seconds, started } = this.state;
    
    if (seconds === 0) {
      this.setState(prev => {
        prev.running = false;
        prev.seconds = 60;
        prev.timerId = clearInterval(prev.timerId);
        prev.reqCount = 5;
        prev.started = null;
        return prev;
      });
      
      if (Date.now() - started > 60000) {
        setTimeout(() => this.props.timerReset(), 1500);
      }
    } else {
      this.setState(prev => ({ seconds: prev.seconds - 1 }));
    }
    
    if (this.props.showLoader) {
      this.props.timeRemaining(seconds);
    }
  }
  
  render() {
    return null
  }
}

export default Timer;