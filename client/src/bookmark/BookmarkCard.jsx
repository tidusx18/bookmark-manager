import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';

const styles = {
  card: {
    'min-width': '120px',
    'min-height': '140px',
  },
  link: {
    'text-decoration': 'none',
  },
 chip: {
    margin: '2px',
  },
};

class FavoriteBookmark extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleDelete(id) {
    this.props.delete(id)
  }

  handleEdit(props) {
    this.props.edit(props)
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid className="FavoriteBookmark" item lg={12} sm={6} xs={12}>
          <Card className={classes.card} raised={true} elevation={2}>
            <CardActionArea href={this.props.href} target='_blank'>
              <CardContent>
                <Typography noWrap gutterBottom component='h2' variant='title'>
                  {this.props.anchorText}
                </Typography>
                <Typography noWrap gutterBottom component='h3' variant='caption'>
                  {this.props.href}
                </Typography>
                <div>
                {
                  this.props.tags.map( (tag) => {
                    return <Chip
                            className={classes.chip}
                            key={tag._id}
                            variant='outlined'
                            label={tag.name}
                            color='primary'
                          />
                  })
                }
                </div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <IconButton disableRipple onClick={ () => { this.handleEdit(this.props) } }>
                <EditIcon />
              </IconButton>
              <IconButton disableRipple onClick={ () => { this.handleDelete(this.props.id) } }>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(FavoriteBookmark);