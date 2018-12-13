import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import  Bookmarks from '../bookmark/list/index.jsx';
import  Tags from '../tag/index.jsx';
import  AddBookmark from '../bookmark/add/index.jsx';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: '#ffffff'
  },
  grow: {
    flexGrow: 1,
  },
});

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <Router>
        <div>
        <AppBar position='relative'>
          <Toolbar>
            <Button className={classes.button} color='default' href="/">Bookmarks</Button>
            <Button className={classes.button} color='default' href="/tags">Tags</Button>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
          <hr />

          <Route exact path="/" component={Bookmarks} />
          <Route path="/tags" component={Tags} />
        </div>
      </Router>
    )
  }
}

export default withStyles(styles)(Nav);