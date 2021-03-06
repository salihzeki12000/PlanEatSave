import React, { Component } from 'react';
import '../../utils/WindowResizeEventOptimized';
import './App.css';

class App extends Component {
  render() {
    var _this = this;

    return (
      <div className="full-height">
        {React.Children.map(this.props.children, (child => React.cloneElement(child, { router: _this.props.router })))}
      </div>
    );
  }
}

export default App;
