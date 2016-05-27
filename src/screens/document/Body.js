import React, { Component, PropTypes } from 'react';

import Verse from './Verse';

export default class Body extends Component {
    constructor(props) {

        super(props);
        // this.renderVerse = this.renderVerse.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        const { text, encoding, documentId } = this.props;

        if (text === nextProps.text && encoding === nextProps.encoding && documentId === nextProps.documentId) {
            return false;
        }

        return true;
    }

    renderVerse(numVerses, verse, verseIndex) {

        const { documentId, encoding } = this.props;

        return (
            <Verse
                documentId={ documentId }
                verse={ verse }
                encoding={ encoding }
                isLast={ verseIndex === numVerses - 1 }
                isFirst={ verseIndex === 0 }
                key={ verse.id }
                />
        );
    }

    render() {

        const { text } = this.props;

        const numVerses = text.length;

        return (
            <div style={ styles.mainBody }>
                { text.map(this.renderVerse.bind(this, numVerses)) }
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
        // marginTop: 10
    }
};
