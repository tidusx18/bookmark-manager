import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';

const styles = {
  link: {
    textDecoration: 'none',
    wordBreak: 'break-word',
  },
  chip: {
    margin: '2px',
  },
  li: {
    '&:hover': {
      backgroundColor: '#f0f0f0'
    }
  }
};

class FavoriteBookmark extends React.Component {
  constructor(props) {
    super(props);

    this.handleVertMenuClick = this.handleVertMenuClick.bind(this);
    this.setCheckedBookmarks = this.setCheckedBookmarks.bind(this);
  }

  handleVertMenuClick(elem, props) {
    this.props.vertMenu(elem, props);
  }

  setCheckedBookmarks(event) {
    this.props.setCheckedBookmarks(event);
  }

  render() {
    const { classes } = this.props;

    return (
          <ListItem disableGutters dense divider className={classes.li}>


              {
                this.props.batchActions ?

                <Checkbox classes={{class: 'mycheckbox'}} value={JSON.stringify(this.props.bookmark)} onChange={this.setCheckedBookmarks} />

                :

                <IconButton
                  disableRipple
                  onClick={ (event) => { this.handleVertMenuClick(event.target, this.props.bookmark) }}>
                  <MoreVertIcon />
                </IconButton>

              }

            <ListItemText>
              <Typography component='a' variant='body2' className={classes.link} href={this.props.bookmark.url} target='_Blank'>{this.props.bookmark.title}</Typography>
              <Typography component='a' variant='caption' className={classes.link} href={this.props.bookmark.url} target='_Blank'>{this.props.bookmark.url}</Typography>
                  {
                    this.props.bookmark.tags.map( (tag) => {
                      return <Chip
                              key={tag._id}
                              className={classes.chip}
                              variant='outlined'
                              label={tag.name}
                              color='primary'
                            />
                      })
                  }
            </ListItemText>

          </ListItem>
    );
  }
}

export default withStyles(styles)(FavoriteBookmark);