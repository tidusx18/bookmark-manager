import React from 'react';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  filter: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '40%',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    // paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  paper: {
    'display': 'block',
    'position': 'absolute',
    'margin-top': '5px',
    'width': '400px',
    'max-height': '200px',
    'overflow': 'auto',
    'z-index': 1,
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

class Filter extends React.Component {

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleTagsClear = this.handleTagsClear.bind(this);
    this.filterTags = this.filterTags.bind(this);
  }

  handleInputChange(event) {
    this.props.setFilterValue(event.target.value);
  }

  handleTagClick(tag) {
    this.props.setFilterTags(tag);
    // this.setState({ 'tags': this.state.tags.filter( tag => tag._id !== selectedItem._id ) })
    this.props.setFilterValue('');
    this.filterInput.focus();
  }

  handleTagsClear() {
    this.props.clearFilterTags();
  }

  filterTags() {

    let input = this.props.filterValue;

    if(!input) { return null; }

    let tagsNotSelected = this.props.allTags.filter( tag => !this.props.filterTags.find( filterTag => tag._id === filterTag._id ) );
    // array of tags to display that match input value
    let tagsMatchingInput = tagsNotSelected.filter(tag => tag.name.toLowerCase().includes(input.toLowerCase()) );
      console.log(tagsNotSelected)

    if(input && tagsNotSelected.length > 0 && tagsMatchingInput.length > 0) {


      const { classes } = this.props;

      return (
        <Paper className={classes.paper}>
        {
            tagsMatchingInput.map((tag, index) => (
              <MenuItem
                key={tag._id}
                tabIndex={0}
                onClick={ () => { this.handleTagClick(tag) } }
              >
                {tag.name}
              </MenuItem>
            ))
          }
        </Paper>
      )
    }

    return null;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.filter}>
        <Input
          name="filter"
          id="filter"
          autoFocus
          inputRef={input => this.filterInput = input}
          placeholder="Filter..."
          value={this.props.filterValue}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onChange={this.handleInputChange}
        />
        {
          // tag select options
          this.filterTags()
        }
      </div>
    );
  }
}

export default withStyles(styles)(Filter);