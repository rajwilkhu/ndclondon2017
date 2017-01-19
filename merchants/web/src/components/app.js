import React from 'react';
import ImagesList from './images-list';
import UploadImage from './upload-image';
import fetch from 'fetch-everywhere';

require('style!css!foundation-sites/dist/foundation.min.css');
$(document).foundation();

const baseUri = 'https://e6s65gvp0m.execute-api.us-east-1.amazonaws.com/dev';
const images = [];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { images };
        this.getAllSavedImages();
    }

    getAllSavedImages() {
        const self = this;
        fetch(`${baseUri}/uploads`)
          .then(this.throwIfApiCallFails)
          .then(response => {
            return response.json().then(data => {
              self.setState({ images: data });
            });
          }).catch(error => {
              console.log(error);
            throw new Error(JSON.stringify(error));
          });
    }

    throwIfApiCallFails(response) {
        if (!response.ok) {
          throw new Error(JSON.stringify({ code: response.statusCode, message: response.statusText, category: 'api:request' }));
        }
        return response;
      }

    render() {
        return (
            <div>
                <div className="row large-6 large-offset-5 medium-6 medium-offset-5 small-6 small-offset-5 columns">
                    <h3>My Uploaded Images</h3>
                </div>
                <UploadImage uploadImages={this.uploadImages.bind(this)} />
                <ImagesList images={this.state.images}/>
            </div>
        );
    }

    uploadImages(images) {
      images.forEach(image => {
        const fileReader = new FileReader();
        fileReader.addEventListener('loadend', () => {
          fetch(`${baseUri}/signed-uris`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: image.name,
              type: image.type
            })
          }).then(response => {
            return response.json();
          }).then(json => {
            return fetch(json.uploadUri, {
              method: 'PUT',
              body: new Blob([fileReader.result], { type: image.type })
            })
          }).then(() => {
            this.getAllSavedImages();
          })
        })
        fileReader.readAsArrayBuffer(image);
      })
    }

    createTask(task) {
        var self = this;
        self.state.todos.unshift(task);
        self.setState({todos: self.state.todos});
    }
}
