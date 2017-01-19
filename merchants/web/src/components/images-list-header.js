import React from 'react';

export default class ImagesListHeader extends React.Component {
    render(){
        return (
            <thead>
                <tr>
                    <th width="250">Name</th>
                    <th width="250">Size</th>
                    <th width="250">Last Modified</th>
                    <th width="250">Discovered Tags</th>
                </tr>
            </thead>
        );
    }
}
