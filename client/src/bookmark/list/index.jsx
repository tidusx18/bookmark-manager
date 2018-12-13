import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Bookmark from './Bookmark.jsx';
import Filter from '../../form/Filter.jsx';
import EditBookmark from './EditBookmark.jsx';

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
      modalOpen: false,
      modalProps: {},
    };

    this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleAddBookmarkClick = this.handleAddBookmarkClick.bind(this);
    this.setModalState = this.setModalState.bind(this);
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
        // let bookmarks = this.state.bookmarks.map( bookmark => {
        //     if(bookmark._id !== res._id) { return bookmark; }

        //     return {
        //       _id: props.id,
        //       tags: props.tags,
        //       title: props.title,
        //       url: props.href,
        //     }
        //   });

        // this.setState({
        //   modalOpen: false,
        //   bookmarks: bookmarks,
        // });

        fetch('api/bookmarks')
        .then( res => res.json() )
        .then( res => this.setState({ modalOpen: false, bookmarks: res }) )
      });

  }

  handleDelete(id) {
    fetch(`/api/bookmarks/${id}/delete`, {
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

  setModalState(name, value) {
    let props = this.state.modalProps;
    props[name] = value;

    this.setState({ modalProps: props });
  }

  handleEditClick(props) {

    this.setState({
      modalOpen: true,
      modalProps: {
        id: props.id,
        title: props.anchorText,
        url: props.href,
        tags: props.tags,
        tagsInputValue: props.tagsInputValue,
      }
    });
}

  handleAddBookmarkClick() {

    this.setState({
      modalOpen: true,
      modalProps: {
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

    // wait for bookmarks to be assigned in state
    if(this.state.bookmarks.length === 0) { return null; }

    return (
      <Grid className="bookmarks" container spacing={24} justify="flex-start">
        <Grid item xs={12}>
          <Filter setFilterValue={this.handleFilterInputChange} />
          <Button
            className={classes.button}
            size='medium'
            variant='contained'
            color='primary'
            onClick={this.handleAddBookmarkClick}
            >
              Add Bookmark
            </Button>
        </Grid>
         <Modal className={classes.modal} open={this.state.modalOpen} onClose={this.handleModalClose}>
          <Paper className={classes.paper}>
            <EditBookmark
              id={this.state.modalProps.id}
              href={this.state.modalProps.url}
              title={this.state.modalProps.title}
              tags={this.state.modalProps.tags}
              tagsInputValue={this.state.modalProps.tagsInputValue}
              setModalState={this.setModalState}
              handleSubmit={this.handleSubmit}
            />
          </Paper>
        </Modal>
        {
          this.state.bookmarks.map( (bookmark, index) => {

            // render only items with bookmark/tag names that match input (filter)
            let bookmarkMatch = bookmark.title.toLowerCase().includes(this.state.filterValue.toLowerCase());
            let tagMatch = bookmark.tags.find( tag => tag.name.toLowerCase().includes(this.state.filterValue.toLowerCase()));

            if(!bookmarkMatch && !tagMatch) { return null; }

            return <Bookmark
                      key={bookmark._id}
                      id={bookmark._id}
                      href={bookmark.url}
                      anchorText={bookmark.title}
                      tags={bookmark.tags}
                      delete={this.handleDelete}
                      edit={this.handleEditClick}
                    />
          })
        }
      </Grid>
    )
  }
}

export default withStyles(styles)(BookmarkManager);