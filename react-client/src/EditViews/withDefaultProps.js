import React from 'react';

export const withDefaultProps = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <WrappedComponent {...this.props} defaultProps={{
                    isOpen: this.props.isOpen,
                    onClose: this.props.onClose,
                    commitValid: this.props.valid,
                    loading: this.props.loading,
                    error: this.props.error
                }}/>
            );
        }
    }
};