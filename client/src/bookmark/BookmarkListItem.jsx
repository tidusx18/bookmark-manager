import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';

const styles = {
  link: {
    'text-decoration': 'none',
  },
  chip: {
    margin: '2px',
  },
  li: {
    '&:hover': {
      'background-color': '#f0f0f0'
    }
  }
};

class FavoriteBookmark extends React.Component {
  constructor(props) {
    super(props);

    this.handleVertMenuClick = this.handleVertMenuClick.bind(this);
  }

  handleVertMenuClick(elem, props) {
    this.props.vertMenu(elem, props);
  }

  render() {
    const { classes } = this.props;

    return (
          <ListItem disableGutters dense divider className={classes.li}>
              <IconButton
                disableRipple
                onClick={ (event) => { this.handleVertMenuClick(event.target, this.props) }}>
                <MoreVertIcon />
              </IconButton>
            <ListItemText>
              <Typography component='a' variant='body2' className={classes.link} href={this.props.href} target='_Blank'>{this.props.anchorText}</Typography>
              <Typography component='a' variant='caption' className={classes.link} href={this.props.href} target='_Blank'>{this.props.href}</Typography>
                  {
                    this.props.tags.map( (tag) => {
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