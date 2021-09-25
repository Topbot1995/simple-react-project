import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

class Layout extends Component {
  constructor(props){
    super(props);
    this.changelocation = this.changelocation.bind(this);
    this.state = {memu:null};
  }
  changelocation(e) {
    const value =  e.target.value;
    if(value == 0){
      window.location.href  = "/";
      this.state = {memu:0};
    }
    else {
      window.location.href  = "/file";
      this.state = {memu:1};
    }
  }
  render() {
    return (
      <React.Fragment>
          <AppBar position="static" style={{marginBottom: "50px"}}>
        <Toolbar>
          <IconButton edge="start"  color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" >
            CODE Converter
          </Typography>
          <FormControl color="primary" style={{marginLeft:"40px"}}>        
        <Select
          native
          label="Age"
          onChange={this.changelocation}
          inputProps={{
            name: 'MENU',
            id: 'outlined-age-native-simple'
          }} style={{backgroundColor:"#3f51b5", padding:"5px", color:"white"}}
          value = {this.state.menu}
        >         
          <option style={{backgroundColor:"#3f51b5", padding:"5px"}}>MENU</option>
          <option style={{backgroundColor:"#3f51b5", padding:"5px"}} value={0}>HOME</option>
          <option style={{backgroundColor:"#3f51b5", padding:"5px"}} value={1}>FILE</option>
        </Select>
      </FormControl>
        </Toolbar>
      </AppBar>
      {this.props.children}
      
      </React.Fragment>
    );
  }
}

export default Layout;


