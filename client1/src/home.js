import React from 'react';
import Layout from './layout';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Autorenew from '@material-ui/icons/Autorenew';
import Save from '@material-ui/icons/Save';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {useState} from 'react';
import AceEditor from 'react-ace';
import {parse} from 'json-parser';
import axios from 'axios';


// import mode-<language> , this imports the style and colors for the selected language.
import 'ace-builds/src-noconflict/mode-xml'

import 'ace-builds/src-noconflict/mode-hjson';
// there are many themes to import, I liked monokai.
import 'ace-builds/src-noconflict/theme-monokai'
// this is an optional import just improved the interaction.
import 'ace-builds/src-noconflict/ext-language_tools'
//import {beautify} from 'ace-builds/src-noconflict/ext-beautify'
import beautify from 'json-beautify'
// const {json2xml} = require('json_xml')
import json2xml  from 'json2xml'


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {draft:"", result:"", tabSize:4, showAlert:false, type:"0", result:""};
    this.setCode = this.setCode.bind(this);
    this.validate = this.validate.bind(this);
    this.indentChange = this.indentChange.bind(this);
    this.format = this.format.bind(this);
    this.changeType = this.changeType.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.erase_draft = this.erase_draft.bind(this);
    this.erase_result = this.erase_result.bind(this);
    this.new = this.new.bind(this);
    this.save = this.save.bind(this);
    this.validateServer = this.validateServer.bind(this);
    
  }
  setCode(para){
    this.setState({draft:para});
    // console.log(this.state.draft);
  }
  indentChange(event){
    // console.log(this.state.draft);
   this.setState({tabSize : event.target.value});
  }
  validate(){
    // console.log(this.state.draft);
    this.state.showAlert = false;
    this.forceUpdate();
    let draft = this.state.draft;   
    try { 
    draft = parse(draft);
    }
    catch {
      this.state.showAlert = true;
      this.forceUpdate();
      return false;
    }
  }
  validateServer() {
    var self = this;
    this.state.showAlert = false;
    this.forceUpdate();
    let draft1 = this.state.draft;   
      axios.post( 'http://localhost:8081/validate',
          {draft:draft1},
        ).then(function(res){
          console.log('SUCCESS!!');
          if(res.data.result == "0"){
            self.state.showAlert = true;
            self.forceUpdate();
            return false;
          }
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
  }
  format(){
    // console.log(this.state.draft);
    this.state.showAlert = false;
    this.forceUpdate();
    try {
    var format = parse(this.state.draft);
    }
    catch {
      this.state.showAlert = true;
      this.forceUpdate();
      return false;
    }
    var tabSize = Number(this.state.tabSize);
    format = beautify(format, null, tabSize, 20);
    this.setState({result:format});
    console.log(format);
    
  }
  changeType(){
    this.state.showAlert = false;
    this.forceUpdate();
    let draft = this.state.draft;   
    try { 
    draft = parse(draft);
    }
    catch {
      this.state.showAlert = true;
      this.forceUpdate();
      return false;
    }
    console.log(draft);
    if(this.state.type == "0"){
      var tabSize = Number(this.state.tabSize);
      var format = beautify(draft, null, tabSize, 20);
    this.setState({result:format});
    }
    else if(this.state.type == "1")
    this.setState({result : json2xml(draft)});
  }

  // type change
  typeChange(e) {
    this.setState({type : e.target.value});
  }

  erase_result(){
    this.setState({result:""});
    this.forceUpdate();
  }
  erase_draft(){
    this.setState({draft:"", result:""});
    this.forceUpdate();
  }

  new(){
    this.setState({draft:"", result:""});
    this.forceUpdate();
  }
  
  save(){
    var FileSaver = require('file-saver');
    var blob = new Blob([this.state.result], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "result.txt");
  }
    render() {
      return <Layout>
        <Grid container spacing={1} md={12}
      container
      direction="row"
      justifyContent="center"
      alignItems="center">
        <Alert variant="outlined" style={{visibility : this.state.showAlert ? "visible": "hidden"}} severity="error">Syntax Error!</Alert>        
        </Grid>
      <Grid container spacing={1}
      container
      direction="row"
      justifyContent="center"
      alignItems="center">
        <Grid container item md={5} spacing={1}
        container
        direction="row"
        justifyContent="center"
        alignItems="center">

        <Card style={{width:'80%', height:'70vh', marginBottom:'50px'}}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Draft
          </Typography>
          <AceEditor style={{width:'100%', height:'55vh'}}
            mode='hjson'
            theme='monokai'
            name='basic-code-editor'
            onChange={currentCode => this.setCode(currentCode)}
            fontSize={18}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value = {this.state.draft}
            // maxLines={30}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: this.state.tabSize,
                wrapBehavioursEnabled : true
            }}
          />
          {/* <textarea style={{width:'100%', height:'55vh'}}></textarea> */}
        </CardContent>
          <CardActions>
            <Button size="small" onClick={this.erase_draft}>Erase</Button>
          </CardActions>
        </Card>

        </Grid>
        <Grid container item md={2} spacing={1}
        container
        direction="column"
        justifyContent="center"
        alignItems="center">
          <Button id="val_btn" onClick={this.validate} variant="contained" style={{width:'250px', marginBottom:'40px'}}>Validate(LOCAL)</Button>
          <Button id="val_btn" onClick={this.validateServer} variant="contained" style={{width:'250px', marginBottom:'40px'}}>Validate(SERVER)</Button>
          <FormControl style={{width:'250px', marginBottom:'40px'}}>
        <InputLabel htmlFor="age-native-simple" >Indentation</InputLabel>
        <Select
          native onChange={(e)=>{this.indentChange(e)}}
        >
          <option aria-label="None" value=""/>
          <option value={2}>2 Tab Space</option>
          <option value={4}>4 Tab Space</option>
          <option value={6}>6 Tab Space</option>
        </Select>
      </FormControl>
        <Button variant="contained" color="primary" style={{width:'250px', marginBottom:'40px'}} onClick={this.format}>
          Format/Beauty
        </Button>
        <Button variant="contained" color="secondary" style={{width:'250px', marginBottom:'40px'}} onClick={this.changeType}>
          Start Now
        </Button> 
        <FormControl>
        <InputLabel htmlFor="age-native-simple">Convert JSON to</InputLabel>
        <Select
          native style={{width:'250px'}} onChange={this.typeChange}
        >
          <option aria-label="None" value=""/>
          <option value={0}>JSON</option>
          <option value={1}>XML</option>
        </Select>
      </FormControl>
        </Grid>
        <Grid container item md={5} spacing={1}
        container
        direction="row"
        justifyContent="center"
        alignItems="center">
      <Card style={{width:'80%', height:'70vh', marginBottom:'50px'}}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Result
          </Typography>
          <AceEditor style={{width:'100%', height:'55vh'}}
            mode='xml'
            theme='monokai'
            name='basic-code-editor'
            // onChange={currentCode => setCode(currentCode)}
            fontSize={18}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={this.state.result}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: this.state.tabSize,
            }}
          />
          
        </CardContent>
      <CardActions>
        <Button size="small" onClick={this.erase_result}>Erase</Button>
      </CardActions>
    </Card>
        </Grid>
      </Grid>
      <BottomNavigation
      className = "bottom"
      onChange={() => {
        // setValue(newValue);
      }}
      showLabels
      
    >
      <BottomNavigationAction label="NEW" icon={<Autorenew />} onClick={this.new} />
      <BottomNavigationAction label="SAVE" icon={<Save />} onClick={this.save}/>
      <BottomNavigationAction label="GO TO UPLOAD" icon={<CloudUpload/>}  href="/file"/>
    </BottomNavigation>
      </Layout>
    }
  }
  
  export default Home;






