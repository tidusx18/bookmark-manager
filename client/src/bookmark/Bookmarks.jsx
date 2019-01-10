import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BookmarkCard from './BookmarkCard.jsx';
import BookmarkListItem from './BookmarkListItem.jsx';
import Filter from '../form/Filter.jsx';
import BookmarkForm from './BookmarkForm.jsx';

const styles = theme => ({
  button: {
    marginTop: '15px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '400px',
    height: '300px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class BookmarkManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      bookmarks: [],
      filterValue: '',
      alertOpen: false,
      modalOpen: false,
      vertMenuAnchorEl: null,
      menuOpen: false,
      bookmarkProps: {},
    };

    this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
    this.handleVertMenuClick = this.handleVertMenuClick.bind(this);
    this.handleAddBookmarkClick = this.handleAddBookmarkClick.bind(this);
    this.setBookmarkState = this.setBookmarkState.bind(this);
  }


  componentDidMount() {
    Promise.all([
      fetch('/api/tags').then( res => res.json() ),
      fetch('/api/bookmarks').then( res => res.json() )
    ]).then( (res) => {
      console.log('promise land', res)
      this.setState({ tags: res[0], bookmarks: res[1] })
    })
    .catch( err => console.log('ERROR: ', err))
  }

  handleFilterInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(props) {
    // avoid duplicates
    let foundTitle = this.state.bookmarks.find( bookmark => {
      return bookmark.title.match(new RegExp(`^${this.state.title}$`, 'i'));
    });

    let foundUrl = this.state.bookmarks.find( bookmark => {
      return bookmark.url.match(new RegExp(`^${this.state.url}$`, 'i'));
    });

    if(foundTitle || foundUrl) {
      this.setState({ alertOpen: true });
      return;
    }

    let config = {};

    if(!props.id) {
      config.endpoint = 'create'
      config.method = 'POST'
    }
    else {
      config.endpoint = `${props.id}/update`
      config.method = 'PUT'
    }

    fetch(`/api/bookmarks/${config.endpoint}`, {
      method: config.method,
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
            title: props.title,
            url: props.href,
            tags: props.tags,
            })
    })
      .then( res => res.json() )
      .then( res => {
        fetch('api/bookmarks')
        .then( res => res.json() )
        .then( res => this.setState({ modalOpen: false, bookmarks: res }) )
      });

  }

  handleDelete() {
    if( !window.confirm('Delete this bookmark?') ) { return; }

    fetch(`/api/bookmarks/${this.state.bookmarkProps.id}/delete`, {
      method: 'DELETE'
    })
      .then( res => res.json() )
      .then( res => {
        this.setState({
          bookmarks: this.state.bookmarks.filter( bookmark => bookmark._id !== res._id )
        });
      });
  }

  handleModalClose() {
    this.setState({ modalOpen: false });
  }

  setBookmarkState(name, value) {
    let props = this.state.bookmarkProps;
    props[name] = value;

    this.setState({ bookmarkProps: props });
  }

  handleVertMenuClick(anchorEl, props) {
    this.setState({
      menuOpen: true,
      vertMenuAnchorEl: anchorEl,
      bookmarkProps: {
        id: props.id,
        title: props.anchorText,
        url: props.href,
        tags: props.tags,
        tagsInputValue: props.tagsInputValue,
      }
    });
  }

//   handleEdit(props) {

//     this.setState({
//       bookmarkProps: {
//         id: props.id,
//         title: props.anchorText,
//         url: props.href,
//         tags: props.tags,
//         tagsInputValue: props.tagsInputValue,
//       }
//     });
// }

  handleAddBookmarkClick() {

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

  render() {
    const { classes } = this.props;

    return (
      <Grid className="bookmarks" container spacing={24} justify="flex-start">
        <Grid item xs={12}>
          <Filter setFilterValue={this.handleFilterInputChange} />
          <Button
            className={classes.button}
            size='medium'
            variant='contained'
            color='secondary'
            onClick={this.handleAddBookmarkClick}
            >
              Add Bookmark
            </Button>
        </Grid>
         <Modal className={classes.modal} open={this.state.modalOpen} onClose={this.handleModalClose}>
          <Paper className={classes.paper}>
            <BookmarkForm
              id={this.state.bookmarkProps.id}
              href={this.state.bookmarkProps.url}
              title={this.state.bookmarkProps.title}
              tags={this.state.bookmarkProps.tags}
              tagsInputValue={this.state.bookmarkProps.tagsInputValue}
              setBookmarkState={this.setBookmarkState}
              handleSubmit={this.handleSubmit}
            />
          </Paper>
        </Modal>
        <Dialog
          open={this.state.alertOpen}
          onClose={() => this.setState({alertOpen: false})}
        >
          <Paper className={classes.paper}>
            Bookmark already exists
          </Paper>
        </Dialog>
        <Menu
          open={this.state.menuOpen}
          onClick={ () => this.setState({ menuOpen: false }) }
          anchorEl={this.state.vertMenuAnchorEl}
          PaperProps={{ style: { width: 150 } }}
        >
          <MenuItem onClick={ () => { this.setState({ modalOpen: true }) } }>
            Edit
          </MenuItem>
          <MenuItem onClick={ () => { this.handleDelete() } }>
            Delete
          </MenuItem>
        </Menu>
        {
          // wait for bookmarks to be assigned in state
          this.state.bookmarks.length === 0 ? null

          :

          this.state.bookmarks.map( (bookmark, index) => {

            // only render items with bookmark/tag names that match input (filter)
            let bookmarkMatch = bookmark.title.toLowerCase().includes(this.state.filterValue.toLowerCase());
            let tagMatch = bookmark.tags.find( tag => tag.name.toLowerCase().includes(this.state.filterValue.toLowerCase()));

            if(!bookmarkMatch && !tagMatch) { return null; }

            return (
              <BookmarkListItem
                key={bookmark._id}
                id={bookmark._id}
                href={bookmark.url}
                anchorText={bookmark.title}
                tags={bookmark.tags}
                delete={this.handleDelete}
                edit={this.handleEdit}
                vertMenu={this.handleVertMenuClick}
                anchorEl={this.state.vertMenuAnchorEl}
                menuOpen={this.state.menuOpen}
              />
            )
          })
        }
      </Grid>
    )
  }
}

export default withStyles(styles)(BookmarkManager);