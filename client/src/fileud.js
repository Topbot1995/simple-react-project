import React from 'react';
import Layout from './layout';
import Button from '@material-ui/core/Button';
// import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { DropzoneArea } from 'material-ui-dropzone';
import Typography from '@material-ui/core/Typography';
import AceEditor from 'react-ace';
import UploadService from "./upload-files.service";
import http from "./http-common";
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => createStyles({
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
}));



class FileUD extends React.Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      download_disabled:true,
      progress: 0,
      message: "",

      fileInfos: [],
    };
  }
  selectFile(event) {
    console.log(event.target.files[0]);
    this.setState({
      selectedFiles: event.target.files[0]
    });
    this.upload();
  }
  download(){
    return http.get("/upload").then(function(response){
      
    })
    .catch(function(){
      console.log('FAILURE!!');
    });;
  }

  upload() {    
    var textdata;
    let currentFile = this.state.selectedFiles;   
    let reader = new FileReader();
    try { reader.readAsText(currentFile[0], "UTF-8");}
    catch {
      return false;
    }
    reader.onload = function(e) {
      textdata = e.target.result;
      console.log(textdata);
      axios.post( 'http://localhost:8081/upload',
          {text:textdata},
        ).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
        
    }   
    this.setState({download_disabled:false});
    
    // console.log(currentFile);
    // this.setState({
    //   progress: 0,
    //   currentFile: currentFile,
    // });
  

    // UploadService.upload(currentFile, (event) => {
    //   this.setState({
    //     progress: Math.round((100 * event.loaded) / event.total),
    //   });
    // })
    //   .then((response) => {
    //     this.setState({
    //       message: response.data.message,
    //     });
    //     return UploadService.getFiles();
    //   })
    //   .then((files) => {
    //     this.setState({
    //       fileInfos: files.data,
    //     });
    //   })
    //   .catch(() => {
    //     this.setState({
    //       progress: 0,
    //       message: "Could not upload the file!",
    //       currentFile: undefined,
    //     });
    //   });

    // this.setState({
    //   selectedFiles: undefined,
    // });
  }
    render() {
      
      return <Layout>
        <Grid container spacing={1}
      container
      direction="row"
      justifyContent="center"
      alignItems="center">
        <Grid container item md={5} spacing={1}
        direction="column"
        justifyContent="center"
        alignItems="center">
        <Typography variant="h4" color='primary' >
          UPLOAD FILE
        </Typography>
        <DropzoneArea
          showPreviews={true}
          showPreviewsInDropzone={false}
          useChipsForPreview
          previewGridProps={{container: { spacing: 1, direction: 'row' }}}
          previewChipProps={{ }}
          previewText="Selected files"
          onDrop={fileObj => this.setState({selectedFiles:fileObj})}
          onChange={fileObj => this.setState({selectedFiles:fileObj})}
        />
        <Button variant="contained" color="primary" style={{width:'250px', margin:'40px'}} onClick={this.upload}>
          UPLOAD
        </Button> 
        <Typography variant="h4" color='primary' style={{margin:"60px"}}>
          DOWNLOAD FILE
        </Typography>
        <form action="http://localhost:8081/upload">
        <Button type="submit" variant="contained" color="secondary" style={{width:'250px', marginBottom:'40px'}} disabled = {this.state.download_disabled}>
          DOWNLOAD
        </Button> 
        </form>
        </Grid>
      </Grid>
      </Layout>;
    }
  }
  
  export default FileUD;


//   import DropZone from './DropZone';

// export const readAsBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//         let reader = new FileReader();
//         reader.addEventListener('load', () => {
//             resolve({file, dataURL: reader.result});
//         });
//         reader.readAsDataURL(file);
//     });
// }

// export default DropZone;
