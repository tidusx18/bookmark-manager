import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '5px',
    margin: '5px',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

class BookmarkManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterInputValue: '',
      filterTags: [],
      alertOpen: false,
      modalOpen: false,
      vertMenuAnchorEl: null,
      menuOpen: false,
      bookmarkProps: {},
    };

    this.setFormState = this.setFormState.bind(this);
    this.handleFilterTagsClick = this.handleFilterTagsClick.bind(this);
    this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
    this.clearFilterTags = this.clearFilterTags.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleVertMenuClick = this.handleVertMenuClick.bind(this);
    this.handleVertMenuClose = this.handleVertMenuClose.bind(this);
    // this.refreshBookmarks = this.refreshBookmarks.bind(this);
  }

  handleFilterInputChange(value) {
    this.setState({ filterInputValue: value });
  }

  handleFilterTagsClick(tag) {
    this.setState({ filterTags: this.state.filterTags.concat([tag]) });
  }

  clearFilterTags() {
    this.setState({ filterTags: [] });
  }

  handleEditClick() {
    this.handleModalOpen();
  }

  handleDeleteClick() {
    if( !window.confirm('Delete this bookmark?') ) { return; }

    fetch(`/api/bookmarks/${this.state.bookmarkProps.id}/delete`, {
      method: 'DELETE'
    })
      .then( res => res.json() )
      .then( res => {
        console.log('Bookmark Deleted: ', res)
        this.handleVertMenuClose();
        this.props.refreshBookmarks();
      } );
  }

  setFormState(props) {
    this.setState({ bookmarkProps: props });
  }

  handleModalOpen() {
    this.setState({ modalOpen: true });
  }

  handleModalClose() {
    this.setState({ modalOpen: false });
    this.handleVertMenuClose();
    this.props.refreshBookmarks();
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

  handleVertMenuClose() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid className="bookmarks" container spacing={24} justify="flex-start">
        <Grid item xs={12}>
          <Filter
            allTags={this.props.tags}
            filterTags={this.state.filterTags}
            filterValue={this.state.filterInputValue}
            setFilterValue={this.handleFilterInputChange}
            setFilterTags={this.handleFilterTagsClick}
            clearFilterTags={this.clearFilterTags}
          />
          <div className={classes.chips}>
          {
            this.state.filterTags ? this.state.filterTags.map( tag => {
            return <Chip
                      className={classes.chip}
                      tabIndex={-1}
                      key={tag._id}
                      label={tag.name}
                      onDelete={ () => {
                        let filterTags = this.state.filterTags;
                        let index = filterTags.findIndex( filterTag => filterTag._id === tag._id );
                        filterTags.splice(index, 1);
                        this.setState({ filterTags: filterTags });
                      }}
                   />
            }) : null
          }
          </div>
        </Grid>
          <BookmarkForm
            tags={this.props.tags}
            bookmarks={this.props.bookmarks}
            modalOpen={this.state.modalOpen}
            bookmarkProps={this.state.bookmarkProps}
            handleModalClose={this.handleModalClose}
            setFormState={this.setFormState}
          />
        <Dialog
          open={this.state.alertOpen}
          onClose={() => this.setState({alertOpen: false})}
        >
          <Paper className={classes.paper}>
            Bookmark already exists
          </Paper>
        </Dialog>
        <Menu
          disableAutoFocusItem
          open={this.state.menuOpen}
          anchorEl={this.state.vertMenuAnchorEl}
          onClose={ () => { this.setState({ menuOpen: false }) }}
          PaperProps={{ style: { width: 150 } }}
        >
          <MenuItem onClick={this.handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={this.handleDeleteClick}>Delete</MenuItem>
        </Menu>
        {
          // wait for bookmarks to be assigned in state
          this.props.bookmarks.length === 0 ? null

          :

          this.props.bookmarks.map( (bookmark, index) => {

            let tagMatch = this.state.filterTags.every( filterTag => bookmark.tags.find( bookmarkTag => bookmarkTag._id === filterTag._id));

            if(!tagMatch) { return null; }

            return (
              <BookmarkListItem
                key={bookmark._id}
                id={bookmark._id}
                href={bookmark.url}
                anchorText={bookmark.title}
                tags={bookmark.tags}
                delete={this.handleDeleteClick}
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