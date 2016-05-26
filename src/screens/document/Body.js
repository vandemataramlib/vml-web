import React, { Component, PropTypes } from 'react';

import Verse from './Verse';

export default class Body extends Component {
    constructor(props) {

        super(props);
        this.renderVerse = this.renderVerse.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        const { text, encoding, documentId } = this.props;

        if (text === nextProps.text && encoding === nextProps.encoding && documentId === nextProps.documentId) {
            return false;
        }

        return true;
    }

    renderVerse(verse) {

        const { documentId, encoding } = this.props;

        return (
            <Verse
                documentId={ documentId }
                verse={ verse }
                encoding={ encoding }
                key={ verse.id }
                />
        );
    }

    render() {

        return (
            <div style={ styles.mainBody }>
                { this.props.text.map(this.renderVerse) }
            </div>
        );
    }
}

Body.propTypes = {
    text: PropTypes.array,
    encoding: PropTypes.string,
    documentId: PropTypes.string
};

const styles = {
    mainBody: {
        marginTop: 10,
        fontFamily: 'Georgia, serif, Siddhanta'
    }
};
