import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from './nav/Nav.jsx';

// ========================================

ReactDOM.render(
	<BrowserRouter>
		<Nav />
  	</BrowserRouter>,
  document.getElementById('root')
);