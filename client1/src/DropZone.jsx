import React, {PropTypes} from 'react';
import classNames from 'classnames';

const ANIMATION_DURATION = 1000;

class BatchDropZone extends React.Component {

    static propTypes = {

        // function that recieves an array of files
        receiveFiles: PropTypes.func.isRequired,

        // will be passed as second argument of receiveFiles function if present
        id: PropTypes.string,

        // if single is set then file input will NOT be multiple
        single: PropTypes.bool,

        // text message that will appear in drop zone
        copy: PropTypes.string,

        // additional classes that will be added to the drop zone wrapper
        className: PropTypes.string,
    }

    constructor() {
        super();

        this.state = {};
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleDragOver(e) {
        e.preventDefault();
        if (this.state.inDropZone)
            return;
        this.setState({inDropZone: true});
    }
    handleDrop(e) {
        e.preventDefault();
        const { dataTransfer } = e;
        const files = [];
        if (dataTransfer.items) {
            for (let i = this.props.single ? dataTransfer.items.length - 1 : 0; i < dataTransfer.items.length; i ++) {
                if (dataTransfer.items[i].kind == "file") {
                    let file = dataTransfer.items[i].getAsFile();
                    files.push(file);
                }
            }
        } else {
            for (let i = this.props.single ? dataTransfer.files.length - 1 : 0; i < dataTransfer.files.length; i ++) {
                files.push(dataTransfer.files[i]);
            }
        }
        this.setState({
            uploading: true
        });
        setTimeout(() => {
            this.setState({
                uploading: false,
                inDropZone: false,
            });
            this.props.receiveFiles(files, this.props.id);
        }, ANIMATION_DURATION);
    }
    handleDragLeave() {
        if (!this.state.inDropZone)
            return;
        this.setState({inDropZone: false});
    }
    handleClick() {
        this.refs.fileInput.click();
    }
    handleFilesFromInput(e) {
        let files = [];
        Array.from(e.currentTarget.files).forEach(file => {
            files.push(file);
        });
        this.setState({
            uploading: true
        });
        setTimeout(() => {
            this.setState({
                uploading: false,
                inDropZone: false,
            });
            this.props.receiveFiles(files, this.props.id);
        }, ANIMATION_DURATION);
    }
    render() {
        let classes = classNames(`drop-it-wrap batch ${this.props.className || ''}`, {
            'active': this.state.inDropZone,
            'uploading': this.state.uploading
        });

        const dropEvents = {
            onDrop: this.handleDrop,
            onDragOver: this.handleDragOver,
            onDragLeave: this.handleDragLeave,
            onClick: this.handleClick
        };

        let err;

        if(this.state.error){
            err = (
                <div className="notification danger">
                    {this.state.error}
                </div>
            );
        }

        const fileInputAttrs = {
            ref: 'fileInput',
            type: 'file',
            onChange: this.handleFilesFromInput.bind(this),
            style: { position: 'absolute', left: -99999999 },
        };

        if (!this.props.single) {
            fileInputAttrs.multiple = true;
        }

        return (
            <div style={{width:'100%', height: '100%'}}>
                {err}
                <div className={classes} {...dropEvents}>
                    <div className="loader">
                        Processing ...
                    </div>
                    <input {...fileInputAttrs} />
                    <div className="default">
                        {this.props.copy || 'Drop image files here or click'}
                    </div>
                </div>
            </div>
        );
    }
}

export default BatchDropZone;