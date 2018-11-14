import React from 'react';
import { connect } from 'react-redux';
import { dispatch } from 'rxjs/internal/observable/pairs';

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
                    editModel: this.props.editModel,
                    onClearResult: this.onClearResult.bind(this),
                    onClose: this.props.onClose,
                    commitValid: this.props.valid,
                    header: this.props.header
                }}/>
            );
        }
    }
};