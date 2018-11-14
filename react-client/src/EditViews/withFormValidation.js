import React from 'react';

export const withFormValidation = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                valid: false
            }
        }

        onToggleValid(value) {
            this.setState({valid: value});
        }

        render() {
            return (
                <WrappedComponent 
                    {...this.props}
                    valid={this.state.valid}
                    formValidation={{
                        onValid: () => this.onToggleValid(true), 
                        onInvalid: () => this.onToggleValid(false)
                    }}
                />
            );
        }
    }
};