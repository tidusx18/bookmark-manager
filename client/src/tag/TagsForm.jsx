import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px'
  },
  paper: {
  	display: 'block',
  	position: 'absolute',
    marginTop: '5px',
    width: '400px',
    maxHeight: '200px',
    overflow: 'auto',
    zIndex: 1,
  },
  tagListPaper: {
  	display: 'block',
  	position: 'absolute',
    marginTop: '5px',
    width: 336,
    maxHeight: '200px',
    overflow: 'auto',
    zIndex: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    width: '400px',
    // height: '300px',
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

class BookmarkForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
      tagsInputGetsFocus: false,
    };

    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTagsMenuItemClick = this.handleTagsMenuItemClick.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.filterTags = this.filterTags.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
  	this.state.tagsInputGetsFocus ? this.tagsInput.focus() : null;
  }

  handleModalClose() {
  	this.props.handleModalClose();
  }

  handleInputChange(event) {
    let bookmarkProps = this.props.bookmarkProps;
    bookmarkProps[event.target.name] = event.target.value;

  	this.props.setFormState(bookmarkProps);
  }

  handleTagsMenuItemClick(selectedItem, event) {
  	let bookmarkProps = this.props.bookmarkProps;

  	if(typeof selectedItem === 'string') {
	    fetch('api/tags/create', {
	      method: 'POST',
	      headers: {
	      'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	            name: selectedItem
	            })
	    })
	      .then( res => res.json() )
	      .then( res => {
	      	bookmarkProps.tags = this.props.bookmarkProps.tags.concat(res);
	      	bookmarkProps.tagsInputValue = '';
			this.props.setFormState(bookmarkProps);
			this.setState({ tagsInputGetsFocus: true });
	      });
  	}

  	if(typeof selectedItem === 'object') {
  		bookmarkProps.tags = this.props.bookmarkProps.tags.concat(selectedItem);
  		bookmarkProps.tagsInputValue = '';
	    this.props.setFormState(bookmarkProps);
	    this.setState({ tagsInputGetsFocus: true });
  	}
  }

  deleteTag(tag) {
	let bookmarkProps = this.props.bookmarkProps;;
	bookmarkProps.tags = bookmarkProps.tags.filter( bookmarkTag => bookmarkTag._id !== tag._id );
	this.props.setFormState(bookmarkProps);
  }

  filterTags() {
  	let input = this.props.bookmarkProps.tagsInputValue;
  	let tags = this.props.tags;
  	let bookmarkProps = this.props.bookmarkProps;

  	if(!input) { return null; }

  	// tags to display that match input value and are not assigned to bookmark
  	let tagsMatchingInput = tags.filter(tag => {
  		let inputMatch = tag.name.toLowerCase().includes(input.toLowerCase());
  		let inUse = this.props.bookmarkProps.tags.find( bookmarkTag => bookmarkTag._id === tag._id);

  		return inputMatch && !inUse;
  	});

  	if(input && tagsMatchingInput.length > 0) {
  		const { classes } = this.props;

  		return (
  			<Paper className={classes.tagListPaper}>
  			{
  			    tagsMatchingInput.map((tag, index) => (
  			      <MenuItem
  			        key={tag._id}
  			        name='tags'
  			        value={tag}
  			        tabIndex={0}
  			        onClick={ event => this.handleTagsMenuItemClick(tag, event) }
  			      >
  			        {tag.name}
  			      </MenuItem>
  			    ))
  			  }
  			</Paper>
  		)
  	}

  	if(input && tagsMatchingInput.length === 0) {
  		const { classes } = this.props;

		return (
			<Paper className={classes.tagListPaper}>
				<MenuItem tabIndex={0} onClick={ event => this.handleTagsMenuItemClick(input) }>{`Create New Tag: ${input}`}</MenuItem>
			</Paper>
		)
  	}

  	return null;
  }

  handleSubmit(event) {
    event.preventDefault();

    let checkedBookmarks = this.props.checkedBookmarks;
    let bookmarkProps = this.props.bookmarkProps;

    checkedBookmarks.forEach( checkedBookmark => {

      let newTags = bookmarkProps.tags.filter( tag => {
        return !checkedBookmark.tags.find( checkedBookmarkTag => checkedBookmarkTag._id === tag._id)
      });

      console.log('Checked Bookmark: ', checkedBookmark._id);
      console.log('New Tags: ', newTags);

      fetch(`/api/bookmarks/${checkedBookmark._id}/update`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
              title: checkedBookmark.title,
              url: checkedBookmark.url,
              tags: checkedBookmark.tags.concat(newTags),
              })
      })
        .then( res => res.json() )
        .then( res => { this.handleModalClose() } );
    });
  }

	render() {
		const { classes } = this.props;

		return (
         <Modal className={classes.modal} open={this.props.modalOpen} onClose={this.handleModalClose}>

			<Paper className={classes.modalPaper}>

         	<Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })}>
	         	<DialogContent>
		         	<Typography variant='body2'>
		         		Bookmark {this.state.dialogContent} already exists.
		         	</Typography>
	         	</DialogContent>
         	</Dialog>

			<form onSubmit={ event => this.handleSubmit(event) }>

			<Input
			  autoFocus
			  name='tagsInputValue'
			  className={classes.input}
			  inputRef={input => this.tagsInput = input}
			  placeholder='Select tags'
			  autoComplete='off'
			  value={this.props.bookmarkProps.tagsInputValue}
			  onChange={this.handleInputChange}
			  onBlur={() => this.setState({ tagsInputGetsFocus: false })}
			/>

			{
				// show tag options that match input and are not in use by bookmark
				this.filterTags()
			}

			<div>
			  {
			    this.props.bookmarkProps.tags ? this.props.bookmarkProps.tags.map( tag => {
			    return <Chip
			    		  name='tags'
			              className={classes.chip}
			              tabIndex={-1}
			              key={tag._id}
			              label={tag.name}
			              onDelete={ () => this.deleteTag(tag) }
			           />
			    }) : null
			  }
			</div>

			<Button
				className={classes.button}
				variant='contained'
				type='submit'
				color='secondary'
				>
				Submit
			</Button>

				</form>

			</Paper>

        </Modal>
		)
	}
}

export default withStyles(styles)(BookmarkForm);