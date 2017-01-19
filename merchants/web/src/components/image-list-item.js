import React from 'react';

export default class ImageListItem extends React.Component {
    render() {
      const image = this.props;
        return (
            <tr>
                <td>{image.name}</td>
                <td>{image.size}</td>
                <td>{image.lastModified}</td>
                <td>{image.tags}</td>
            </tr>
        );
    }
}
