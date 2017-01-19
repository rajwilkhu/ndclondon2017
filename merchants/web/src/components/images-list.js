import _ from 'lodash';
import React from 'react';
import ImagesListHeader from './images-list-header';
import ImageListItem from './image-list-item';

export default class ImagesList extends React.Component {
    renderItems(){
        const props = _.omit(this.props, 'images');
        return _.map(this.props.images, (image, index) => <ImageListItem key={index} {...image} {...props} />);
    }
    render(){
        return (
            <div>
                <div className="row large-6 large-offset-3 medium-6 medium-offset-3 small-6 small-offset-3 columns">                   
                    <table className="hover">
                        <ImagesListHeader/>
                        <tbody>
                           {this.renderItems()}
                        </tbody>
                    </table>                       
                </div>               
            </div>            
        );
    }
}
