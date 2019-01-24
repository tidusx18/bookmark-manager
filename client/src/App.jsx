import React from 'react';
import { Route, withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import AddIcon from '@material-ui/icons/AddCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import LabelIcon from '@material-ui/icons/Label';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Tags from './tag/TagList.jsx';
import Bookmarks from './bookmark/Bookmarks.jsx';
// import Modal from '@material-ui/core/Modal';
import TagsForm from './tag/TagsForm.jsx';
import BookmarkForm from './bookmark/BookmarkForm.jsx';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbarButton: {
    marginLeft: 10,
  },
});

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileOpen: false,
      modalOpen: false,
      tags: [],
      bookmarks: [],
      bookmarkProps: {
        id: '',
        title: '',
        url: '',
        tags: [],
        tagsInputValue: '',
      },
      batchActions: false,
      checkedBookmarks: [],
    };
  }

  componentDidMount() {
    Promise.all([
      fetch('/api/tags').then( res => res.json() ),
      fetch('/api/bookmarks').then( res => res.json() )
    ]).then( (res) => this.setState({ tags: res[0], bookmarks: res[1] }) )
    .catch( err => console.log('ERROR: ', err));
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handlebatchActionsToggle = (event) => {
    this.setState({ batchActions: event.target.checked ? true : false });
  }

  setCheckedBookmarks = (event) => {
    let bookmark = JSON.parse(event.target.value);
    let checkedBookmarks = this.state.checkedBookmarks;

    if(event.target.checked) {
      this.setState({ checkedBookmarks: checkedBookmarks.concat([bookmark]) })
    }

    else {
      let index = this.state.checkedBookmarks.findIndex( checkedBookmark => checkedBookmark._id === bookmark._id);
      checkedBookmarks.splice(index, 1);
      this.setState({ checkedBookmarks: checkedBookmarks });
    }
  }

  handleBatchDeleteClick = () => {
    if( !window.confirm(`Delete ${this.state.checkedBookmarks.length} selected bookmarks?`) ) { return; }

    this.state.checkedBookmarks.forEach( bookmark => {
      fetch(`/api/bookmarks/${bookmark._id}/delete`, {
        method: 'DELETE'
      })
        .then( res => res.json() )
        .then( res => {
          console.log('Bookmark Deleted: ', res)
          this.refreshBookmarks();
        } );
    });
  }


  handlebatchActionsTagsClick = () => {
    this.setState({
      modalOpen: true,
      bookmarkProps: {
        id: '',
        title: '',
        url: '',
        tags: [],
        tagsInputValue: '',
      }
    });
  }

  handleAddBookmarkClick = () => {
    this.setState({
      modalOpen: true,
      bookmarkProps: {
        id: '',
        title: '',
        url: '',
        tags: [],
        tagsInputValue: '',
      }
    });
  };

  setFormState = (props) => {
    this.setState({ bookmarkProps: props });
  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  }

  handleModalClose = () => {
    console.log('app')
    this.setState({ modalOpen: false, checkedBookmarks: [] });
    document.querySelectorAll('input.mycheckbox').forEach( checkbox => console.log(checkbox) );
    this.refreshBookmarks();
  }

  refreshBookmarks = () => {
    console.log('refresh bookmarks')
    fetch('/api/bookmarks')
      .then( res => res.json() )
      .then( res => this.setState({ bookmarks: res }) )
      .catch( err => console.log('Error fetching bookmarks: ', err) );
  }

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />

        <Divider />

        <List>

          <ListItem button component='a' href='/'>
            <ListItemIcon>
              <BookmarksIcon />
            </ListItemIcon>
            <ListItemText primary='Bookmarks' />
          </ListItem>

          <ListItem button component='a' href='/tags'>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary='Tags' />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText primary='Batch Actions' />
            <Switch color='primary' onChange={this.handlebatchActionsToggle} />
          </ListItem>

        </List>

        <Divider />
      </div>
    );

    return (
      <div className={classes.root}>

        <CssBaseline />

        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>

            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant='title' color='inherit' noWrap>
              {document.location.pathname === '/' ? 'Bookmarks' : 'Tags'}
            </Typography>

              {
                document.location.pathname === '/' && !this.state.batchActions ?

                <IconButton className ={classes.toolbarButton} disableRipple color='inherit' onClick={this.handleAddBookmarkClick}>
                  <AddIcon />
                </IconButton>

                : null
              }

              {
                document.location.pathname === '/'  && this.state.batchActions  ?

                <IconButton className ={classes.toolbarButton} disableRipple color='inherit' onClick={this.handleBatchDeleteClick}>
                    <DeleteIcon />
                </IconButton>

                : null
              }

              {
                document.location.pathname === '/'  && this.state.batchActions  ?

                <IconButton className ={classes.toolbarButton} disableRipple color='inherit' onClick={this.handlebatchActionsTagsClick}>
                    <EditIcon />
                </IconButton>

                : null
              }

          </Toolbar>
        </AppBar>

        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

          <Hidden smUp implementation='css'>
            <Drawer
              container={this.props.container}
              variant='temporary'
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>

          <Hidden xsDown implementation='css'>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant='permanent'
              open
            >
              {drawer}
            </Drawer>
          </Hidden>

        </nav>

        {
          this.state.batchActions ?

          <TagsForm
            modalOpen={this.state.modalOpen}
            tags={this.state.tags}
            checkedBookmarks={this.state.checkedBookmarks}
            bookmarkProps={this.state.bookmarkProps}
            handleModalClose={this.handleModalClose}
            setFormState={this.setFormState}
          />

          :

          <BookmarkForm
            modalOpen={this.state.modalOpen}
            tags={this.state.tags}
            bookmarks={this.state.bookmarks}
            bookmarkProps={this.state.bookmarkProps}
            handleModalClose={this.handleModalClose}
            setFormState={this.setFormState}
          />
        }

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route
            exact path='/'
            render={() => {
              return  <Bookmarks
                        tags={this.state.tags}
                        bookmarks={this.state.bookmarks}
                        batchActions={this.state.batchActions}
                        setCheckedBookmarks={this.setCheckedBookmarks}
                        refreshBookmarks={this.refreshBookmarks}
                      />
            }}
          />
          <Route path='/tags' component={Tags} />
        </main>
      </div>
    );
  }
}

// App.propTypes = {
//   classes: PropTypes.object.isRequired,
//   // Injected by the documentation to work in an iframe.
//   // You won't need it on your project.
//   container: PropTypes.object,
//   theme: PropTypes.object.isRequired,
// };

export default withStyles(styles, { withTheme: true })(App);
