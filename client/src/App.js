import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './home';
import FileUD from './fileud';
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><Home /></Route>
        <Route path="/file"><FileUD /></Route>
        </Switch>
    </Router>
  );
}


export default App;

