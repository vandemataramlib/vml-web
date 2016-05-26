import React, { Component, PropTypes } from 'react';
import ActionBookmark from 'material-ui/svg-icons/action/bookmark';

import { DEFAULT_TEXT_ENCODING } from '../shared/constants';
import { translit } from '../shared/utils';

export default class Verse extends Component {
    render() {

        const { encoding } = this.props;

        const contents = this.props.verse.verse.split('\n').map((line, lineIndex) => {

            const lineEl = numLines === lineIndex + 1 && verse.analysis ?
                React.Children.toArray([
                    translit(line.trim(), DEFAULT_TEXT_ENCODING, encoding),
                    <ActionBookmark color={ orange500 } style={ styles.analysedIndicator }/>
                ]) :
                translit(line.trim(), DEFAULT_TEXT_ENCODING, encoding);

            if (lineIndex === 0) {
                return lineEl;
            }

            return React.Children.toArray([
                <br/>,
                lineEl
            ]);
        });

        return (
            <p>
                { contents }
            </p>
        );
    }
}

Verse.propTypes = {
    verse: PropTypes.object,
    encoding: PropTypes.string
};
