import React, { Component, PropTypes } from 'react';

const styles = {
    self: {
        paddingTop: 60,
        paddingBottom: 60
    }
};

export default class Layout extends Component {
    render() {

        return (
            <div className="container" style={ styles.self }>{ this.props.children }</div>
        );
    }
}
