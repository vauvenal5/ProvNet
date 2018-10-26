import React from 'react';

export const withDefaultImage = (WrappedComponent) => {
    return class extends React.Component {

        checkUrl(url) {
            if(url === undefined || url === "") {
                return '/square-image.png';
            }

            return url;
        }

        render() {
            return(<WrappedComponent {...this.props} imageUrl={this.checkUrl(this.props.imageUrl)}/>);
        }
    }
}