import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import ActionBookmark from 'material-ui/svg-icons/action/bookmark';
import FlatButton from 'material-ui/FlatButton';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import { grey300, orange500 } from 'material-ui/styles/colors';

import { DEFAULT_TEXT_ENCODING } from '../shared/constants';
import { translit } from '../shared/utils';

export default class Verse extends Component {
    constructor(props) {

        super(props);
        this.state = {
            hovered: false,
            expanded: false
        };
    }

    handleMouseEnter(event) {

        // if (this.state.annotateMode) {
        // event.target.style.backgroundColor = styles.hovered.backgroundColor;
        this.setState({
            hovered: true
        });
        // }
    }

    handleMouseLeave(event) {

        // if (this.state.annotateMode) {
        // event.target.style.backgroundColor = null;
        this.setState({
            hovered: false
        });
        // }
    }

    handleVerseClick(event) {

        this.setState({
            expanded: !this.state.expanded
        });
    }

    renderPara(verse, line, lineIndex) {

        const numLines = verse.lines.length;

        const { encoding } = this.props;

        const lineEl = translit(line.trim(), DEFAULT_TEXT_ENCODING, encoding);

        // const lineEl = numLines === lineIndex + 1 && verse.analysis ?
        //     React.Children.toArray([
        //         translit(line.trim(), DEFAULT_TEXT_ENCODING, encoding),
        //         <ActionBookmark color={ orange500 } style={ styles.analysedIndicator }/>
        //     ]) :
        //     translit(line.trim(), DEFAULT_TEXT_ENCODING, encoding);

        if (lineIndex === 0) {
            return lineEl;
        }

        return React.Children.toArray([
            <br/>,
            lineEl
        ]);
    }

    render() {

        const { verse } = this.props;
        return (
            <Paper zDepth={ this.state.expanded ? 1 : 0 } style={ this.state.expanded ? styles.self : null }>
                <div onMouseEnter={ this.handleMouseEnter.bind(this) } onMouseLeave={ this.handleMouseLeave.bind(this) } className="row">
                    <div className="col-xs-11">
                        <p style={ { margin: '8px 0' } }>
                            { verse.verse.split('\n').map(this.renderPara.bind(this, verse)) }
                        </p>
                    </div>
                    <div className="col-xs-1" style={ styles.verseHandleContainer }>
                        {
                            this.state.expanded ?
                                <div onTouchTap={ this.handleVerseClick.bind(this) } style={ styles.verseHandle }><KeyboardArrowUp /></div> :
                                (this.state.hovered ? <div onTouchTap={ this.handleVerseClick.bind(this) } style={ styles.verseHandle }><KeyboardArrowDown /></div> : null)
                        }
                    </div>
                </div>
                <div className="row">
                    { this.state.expanded ? <FlatButton label="Action" /> : null }
                </div>
            </Paper>
        );
    }
}

Verse.propTypes = {
    verse: PropTypes.object,
    encoding: PropTypes.string,
    numLines: PropTypes.number
};

const styles = {
    analysedIndicator: {
        float: 'right'
    },
    self: {
        marginBottom: 10
    },
    hovered: {
        backgroundColor: grey300
    },
    verseHandleContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    verseHandle: {
        alignSelf: 'center',
        cursor: 'pointer'
    }
};
