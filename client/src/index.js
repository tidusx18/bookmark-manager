import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Nav from './nav/Nav.jsx';

// ========================================

const theme = createMuiTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#546e7a' },
  },
});

ReactDOM.render(
	<Router>
		<MuiThemeProvider theme={theme}>
	      <Nav />
	    </MuiThemeProvider>
  	</Router>,
  document.getElementById('root')
);