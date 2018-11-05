import React from 'react';
import { EditModalLeaf } from './EditModal';

export const withDefaultProps = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
        }

        onClearResult() {
            this.props.onClose();
            this.props.onClear();
        }

        onSubmit(...values) {
            this.props.onClose();
            this.props.onSubmit(...values);
        }

        render() {
            return (
                <WrappedComponent {...this.props} 
                onSubmit={this.onSubmit.bind(this)}
                defaultProps={{
                    isOpen: this.props.isOpen,
                    loading: EditModalLeaf.isLoading(this.props.editModalLeaf),
                    error: EditModalLeaf.isError(this.props.editModalLeaf),
                    errorProps: EditModalLeaf.getStateProps(this.props.editModalLeaf),
                    onClearResult: this.onClearResult.bind(this),
                    onClose: this.props.onClose,
                    commitValid: this.props.valid,
                }}/>
            );
        }
    }
};