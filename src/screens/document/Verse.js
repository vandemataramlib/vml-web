import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import { slice, concat, findIndex } from 'lodash';
import { orange100, orange500 } from 'material-ui/styles/colors';

import ParagraphDialog from './ParagraphDialog';
import { DEFAULT_TEXT_ENCODING } from '../shared/constants';
import { translit } from '../shared/utils';

export default class Verse extends Component {
    constructor(props) {

        super(props);
        this.state = {
            hovered: false,
            expanded: false,
            popoverOpen: false
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

    handleAnnotateVerse(event, value) {

        if (!this.props.annotateMode) {
            return;
        }

        event.preventDefault();
        this.setState({
            popoverOpen: true
        });
    }

    handleRequestClose() {

        this.setState({
            popoverOpen: false
        });
    }

    handleAnalysisSave(selected, updatedVerse, event) {

        const documents = JSON.parse(localStorage.getItem('documents'));
        const document = documents.find((doc) => doc.id === this.props.documentId);
        const verseIndex = this.props.verse.id - 1;
        const updatedDocumentText = concat([], slice(document.text, 0, verseIndex), updatedVerse, slice(document.text, verseIndex + 1));
        document.text = updatedDocumentText;
        const documentIndex = findIndex(documents, (doc) => doc.id === this.props.documentId);
        const updatedDocuments = concat([], slice(documents, 0, documentIndex), document, slice(documents, documentIndex + 1));
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        this.handleRequestClose(event);
        this.setState({
            updatedVerse
        });

    }

    renderPara(verse, line, lineIndex) {

        // const numLines = verse.lines.length;

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
            <div id={ 'p' + (verse.id + 1) } style={ verse.analysis && !this.state.expanded && this.props.annotateMode ? { borderLeft: `2px solid ${orange500}` } : null }>
                <Paper rounded={ this.props.isLast ? true : false } zDepth={ this.state.expanded ? 2 : 1 } style={ styles.self(this.props, this.state) }>
                    <div onMouseEnter={ this.handleMouseEnter.bind(this) } onMouseLeave={ this.handleMouseLeave.bind(this) } className="row">
                        <div onTouchTap={ this.handleAnnotateVerse.bind(this) } style={ styles.verseContent(this.props) } className="col-xs-11">
                            <p style={ styles.verse(this.state) }>
                                { verse.verse.split('\n').map(this.renderPara.bind(this, verse)) }
                            </p>
                            <div className="row" style={ { display: this.state.expanded ? 'block' : 'none' } }>
                                {
                                    verse.analysis ? <div style={ { paddingBottom: 10 } }className="col-xs-12">{ translit(verse.analysis.map((a) => a.token).join(' ')) }</div> : null
                                }
                            </div>
                        </div>
                        <div className="col-xs-1" style={ styles.verseHandleContainer } onTouchTap={ this.handleVerseClick.bind(this) }>
                            {
                                this.state.expanded ?
                                    <div style={ styles.verseHandle }><KeyboardArrowUp /></div> :
                                    (this.state.hovered ? <div onTouchTap={ this.handleVerseClick.bind(this) } style={ styles.verseHandle }><KeyboardArrowDown /></div> : null)
                            }
                        </div>
                    </div>
                </Paper>
                <ParagraphDialog
                    open={ this.state.popoverOpen }
                    verse={ verse }
                    onRequestClose={ this.handleRequestClose.bind(this) }
                    onSave={ this.handleAnalysisSave.bind(this) }
                    />
            </div>
        );
    }
}

Verse.propTypes = {
    verse: PropTypes.object,
    encoding: PropTypes.string,
    numLines: PropTypes.number,
    annotateMode: PropTypes.bool,
    documentId: PropTypes.string,
    isLast: PropTypes.bool
};

const styles = {
    analysedIndicator: {
        float: 'right'
    },
    self: (props, state) => {

        let style = {
            padding: '0 20px',
            borderTopRightRadius: props.isLast ? 0 : 'inherit',
            borderTopLeftRadius: props.isLast ? 0 : 'inherit'
        };

        if (!state.expanded) {
            // style = { ...style, padding: props.verse.analysis && props.annotateMode ? '0 20px 0 18px' : '0 20px' };
            if (!props.annotateMode) {
                style = { ...style, boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 6px 6px, rgba(0, 0, 0, 0.117647) 0px 6px 6px' };
            }
            else {
                if (state.hovered) {
                    style = { ...style, backgroundColor: orange100 };
                }
            }

            if (props.isLast) {
                style = { ...style, padding: '0 20px 20px 20px' };
            }
            // else if (props.isFirst) {
            //     style = { ...style, padding: '20px 20px 0px 20px' }
            // }
        }
        else if (state.expanded) {
            style = { ...style, margin: '20px -20px 20px -20px' };
        }

        return style;
    },
    hovered: {
        backgroundColor: orange100
    },
    verseHandleContainer: {
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    verseHandle: {
        alignSelf: 'center'
    },
    verse: (state) => {

        return {
            fontFamily: 'Monotype Sabon, Auromere, serif, Siddhanta',
            margin: '8px 0',
            fontSize: state.expanded ? '1.5em' : '1em'
        };
    },
    verseContent: (props) => {

        if (props.annotateMode) {
            return {
                cursor: 'context-menu'
            };
        }
    }
};
