import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
// import Filter from '../form/Filter.js';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
  	display: 'block',
    'max-width': '150px',
    'text-align': 'center'
  }
});

class TagList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      tags: [],
      alertOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/tags')
      .then( (res) => res.json() )
      .then( (res) => {
        this.setState({tags: res})
      })
      .catch( err => console.log(err))
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleEdit(id) {
    console.log('TODO: handleEdit()')
    // fetch(`/api/tags/${id}/update`, {
    //   method: 'PUT'
    // })
    //   .then( res => res.json() )
    //   .then( res => {
    //     this.setState({
    //       tags: this.state.tags.filter( tag => tag._id !== res._id )
    //     });
    //   });
  }

  handleDelete(id) {
    fetch(`/api/tags/${id}/delete`, {
      method: 'DELETE'
    })
      .then( res => res.json() )
      .then( res => {
        this.setState({
          tags: this.state.tags.filter( tag => tag._id !== res._id )
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();

    // avoid duplicates
    let found = this.state.tags.find( tag => {
      return tag.name.match(new RegExp(`^${this.state.value}$`, 'i'));
    });

    if(found) {
      this.setState({alertOpen: true});
      return;
    }

    fetch(`/api/tags/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: this.state.value})
    })
      .then( res => res.json() )
      .then( res => {
        console.log(`Form submited: ${res}`);
        console.log(this.state.tags);
        this.setState({tags: this.state.tags.concat(res)});
        this.setState({value: ''});
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <Dialog open={this.state.alertOpen} onClose={() => this.setState({alertOpen: false})}>Tag already exists</Dialog>
				<Input
					className={classes.input}
					inputProps={{
						placeholder: 'Tag Name',
						value: this.state.value,
						autoFocus: true,
					}}
					onChange={this.handleChange}
				/>
				<Button
					className={classes.button}
					variant='contained'
					type='submit'
					>
					Submit
				</Button>
			</form>
      <Divider />
      <List>
        {
          this.state.tags.map( tag => {
            return (
              <ListItem
                key={tag._id}
                dense
                >
                <IconButton onClick={ event => this.handleEdit(tag._id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={ event => this.handleDelete(tag._id)}>
                  <DeleteIcon />
                </IconButton>
                <ListItemText primary={tag.name} />
              </ListItem>
            )
          })
        }
      </List>
      </div>
		)
	}
}

export default withStyles(styles)(TagList);