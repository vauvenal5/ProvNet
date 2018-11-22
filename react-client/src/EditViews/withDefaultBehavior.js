import React from 'react';
import { connect } from 'react-redux';
import { dispatch } from 'rxjs/internal/observable/pairs';

export const withDefaultBehavior = (WrappedComponent) => {
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
                onClear={this.onClearResult.bind(this)}/>
            );
        }
    }
};