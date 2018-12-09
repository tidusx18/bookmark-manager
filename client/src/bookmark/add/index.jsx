import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    'display': 'block',
    'max-width': '200px',
    'text-align': 'center',
    'margin-top': '25px'
  },
  paper: {
  	'display': 'block',
    'max-width': '200px',
    'margin-top': '5px',
    'max-height': '300px',
    'overflow': 'hidden',
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

class AddBookmark extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      existingTags: [],
      bookmarks: [],
      tags: [],
      title: '',
      url: '',
      alertOpen: false,
      inputValue: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.handleChipDelete = this.handleChipDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    Promise.all([
      fetch('/api/tags').then( res => res.json() ),
      fetch('/api/bookmarks').then( res => res.json() )
    ]).then( (res) => {
      console.log('promise land', res)
      this.setState({ existingTags: res[0], bookmarks: res[1] })
    })
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // clear input on blur if not clicking on DOM elem
  handleInputBlur(event) {
    !event.relatedTarget ? this.setState( { [event.target.name]: '' } ) : null;
  }

  handleMenuItemClick(selectedItem) {
    console.log('menu item', selectedItem)

    this.setState({
      tags: this.state.tags.concat(selectedItem),
      existingTags: this.state.existingTags.filter( tag => tag.name !== selectedItem.name ),
      inputValue: '',
    })

    this.selectTagsInput.focus();
  }

  handleChipDelete(chip) {
    console.log('chip', chip)

    this.setState({
      existingTags: this.state.existingTags.concat(chip),
      tags: this.state.tags.filter( tag => tag.name !== chip.name )
    })
  }

  handleSubmit(event) {
    event.preventDefault();

    // avoid duplicates
    // pull out to its own function
    let foundTitle = this.state.bookmarks.find( bookmark => {
      return bookmark.title.match(new RegExp(`^${this.state.title}$`, 'i'));
    });

    let foundUrl = this.state.bookmarks.find( bookmark => {
      return bookmark.url.match(new RegExp(`^${this.state.url}$`, 'i'));
    });

    if(foundTitle || foundUrl) {
      this.setState({alertOpen: true});
      return;
    }

    fetch(`/api/bookmarks/create`, {
    	method: 'POST',
    	headers: {
    		'Content-Type': 'application/json'
    	},
    	body: JSON.stringify({
        tags: this.state.tags,
        title: this.state.title,
        url: this.state.url
      })
    })
    	.then( res => res.text() )
    	.then( res => {
        console.log(`Form submited: ${res}`);
        this.setState({bookmarks: this.state.bookmarks.concat(res)});
      });

    this.setState({
      title: '',
      url: ''
    });
  }

	render() {
		const { classes } = this.props;

		return (
			<form onSubmit={this.handleSubmit}>
        <Dialog open={this.state.alertOpen} onClose={() => this.setState({alertOpen: false})}>Bookmark already exists</Dialog>
        <Input
          autoFocus
          inputRef={input => this.selectTagsInput = input}
          placeholder='Select tags'
          name='inputValue'
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputBlur}
        />

        {
          this.state.inputValue ?
          <Paper className={classes.paper}>
            {
              this.state.existingTags
                .filter(item => !this.state.inputValue || item.name.toLowerCase().includes(this.state.inputValue.toLowerCase()))
                .map((item, index) => (
                  <MenuItem
                    key={item._id}
                    onClick={ event => this.handleMenuItemClick(item) }
                  >
                    {item.name}
                  </MenuItem>
                ))
              }
          </Paper> : null
        }
        <div>
          {
            this.state.tags.length > 0 ? this.state.tags.map( tag => {
            return <Chip
                      className={classes.chip}
                      key={tag._id}
                      label={tag.name}
                      onDelete={ event => this.handleChipDelete(tag) }
                    />
            }) : null
          }
        </div>
        <Input
          name='title'
          className={classes.input}
          inputProps={{
						placeholder: 'Bookmark Title',
            value: this.state.title,
          }}
          onChange={this.handleInuptChange}
        />
        <Input
          name='url'
          className={classes.input}
          inputProps={{
            placeholder: 'URL',
						value: this.state.url,
					}}
					onChange={this.handleInuptChange}
				/>
				<Button
					className={classes.button}
					variant='contained'
					type='submit'
					>
					Submit
				</Button>
			</form>
		)
	}
}

export default withStyles(styles)(AddBookmark);