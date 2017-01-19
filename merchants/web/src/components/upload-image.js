import React from 'react';
import Dropzone from 'react-dropzone';

export default class UploadImage extends React.Component {
  render() {
    return (
      <div>
        <div className="row large-6 large-offset-3 medium-6 medium-offset-3 small-6 small-offset-3 columns">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <div>Drop your images here, or click to select files to upload.</div>
          </Dropzone>
        </div>
      </div>
    );
  }

  onDrop(acceptedFiles) {
    console.log(this.props);
    this.props.uploadImages(acceptedFiles);
  }
}
