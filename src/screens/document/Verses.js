import React, { Component, PropTypes } from 'react';

import Verse from './Verse';

export default class Verses extends Component {
    render() {

        const { documentId, text, encoding } = this.props;

        const verses = text.map((verse) => {

            return (
                <Verse
                    documentId={ documentId }
                    verse={ verse }
                    encoding={ encoding }
                    key={ verse.id }
                    />
            );
        });

        return (
            <div>
                { verses }
            </div>
        );
    }
}

Verses.propTypes = {
    text: PropTypes.object,
    encoding: PropTypes.string,
    documentId: PropTypes.string
};
