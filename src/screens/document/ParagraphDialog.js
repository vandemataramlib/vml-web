import React, { Component, PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import Sortable from 'react-anything-sortable';
import { grey300, grey500, orange500 } from 'material-ui/styles/colors';
import { assign, flatten } from 'lodash';

import WordPopover from './WordPopover';
import SortableToken from './SortableToken';
import { translit, getColour } from '../shared/utils';

export default class ParagraphDialog extends Component {
    constructor(props) {

        super(props);
        this.handleWordClicked = this.handleWordClicked.bind(this);
        this.handleTokenSort = this.handleTokenSort.bind(this);
        this.handleAnalyseClick = this.handleAnalyseClick.bind(this);
        this.state = {
            wordPopoverOpen: false,
            showAnalysis: false,
            analysedTokens: [],
            rearrangedTokens: []
        };
    }

    componentWillMount() {

        const documents = JSON.parse(localStorage.getItem('documents'));
        const document = documents.find((document) => document.id === this.props.selected.docId);
        const verse = document.text[this.props.selected.verseId - 1];
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleSaveWordAnalysis = this.handleSaveWordAnalysis.bind(this);
        this.handleCancelWordPopover = this.handleCancelWordPopover.bind(this);
        this.setState({
            verse: assign({}, verse)
        });
    }

    handleWordHoveredIn(event) {

        event.target.style.backgroundColor = styles.hovered.backgroundColor;
    }

    handleWordHoveredOut(event) {

        event.target.style.backgroundColor = null;
    }

    handleWordClicked(event, value) {

        event.preventDefault();
        const word = event.target.attributes['data-word'].value;
        const wordId = event.target.attributes['data-word-id'].value;
        const lineId = event.target.parentElement.parentElement.id;
        this.setState({
            wordPopoverOpen: true,
            anchorEl: event.currentTarget,
            word: { id: wordId, word },
            line: { id: lineId }
        });
    }

    handleSaveWordAnalysis(event, value) {

        this.handleRequestClose(event);
        const updatedLines = this.state.verse.lines.map((line) => {
            if (line.id === this.state.line.id) {
                line.words.map((word) => {
                    if (word.id === this.state.word.id) {
                        word.analysis = value.analysis;
                    }

                    return word;
                });
            }
            return line;
        });

        const verse = assign({}, this.state.verse, { lines: updatedLines });

        let analysedTokens = [];

        const unanalysedLine = verse.lines.find((line) => {

            const unanalysedWord = line.words.find((word) => {

                if (word.analysis) {
                    analysedTokens.push(word.analysis.map((analysedToken) => { return { id: analysedToken.id, token: analysedToken.token }; }));
                }
                return !word.analysis ? true : false;
            });

            return unanalysedWord ? true : false;
        });

        analysedTokens = flatten(analysedTokens);

        this.setState({
            verse,
            stillUnalysed: unanalysedLine ? true : false,
            analysedTokens,
            rearrangedTokens: analysedTokens
        });
    }

    handleCancelWordPopover(event) {

        this.handleRequestClose(event);
    }

    handleRequestClose() {

        this.setState({
            wordPopoverOpen: false,
            word: null
        });
    }

    handleTokenSort(data) {

        // console.log(data);
        this.setState({
            rearrangedTokens: data
        });
    }

    handleAnalyseClick() {

        this.setState({
            showAnalysis: true,
            rearrangedTokens: this.state.analysedTokens
        });
    }

    render() {
        
        console.log('render');

        return (
            <div>
                <p style={ styles.paragraph }>
                    { this.state.verse.lines.map((line, lineIndex) => {

                        const wordsMap = line.words.map((word, wordIndex) => {

                            const wordEl = (
                                <span style={ styles.wordContainer } key={ word.id }>
                                    <span
                                        data-word={ word.word }
                                        data-word-id={ word.id }
                                        onMouseOver={ this.handleWordHoveredIn }
                                        onMouseOut={ this.handleWordHoveredOut }
                                        onTouchTap={ this.handleWordClicked }
                                        style={ styles.word }
                                        key={ word.id }
                                        >
                                        { translit(word.word) }
                                    </span>
                                    <span style={ styles.analysedTokens }>
                                        {
                                            word.analysis ? word.analysis.map((w, i) => {
                                                return React.Children.toArray([
                                                    <span style={ { color: grey500 } }> { i === 0 ? '' : '+' } </span>,
                                                    <span style={ { color: getColour(i) } }>{ translit(w.token) }</span>
                                                ]);
                                            }) : null
                                        }
                                    </span>
                                </span>
                            );
                            return wordIndex === 0 ?
                                wordEl :
                                React.Children.toArray([
                                    <span style={ styles.emptySpace }>&nbsp; </span>,
                                    wordEl
                                ]);
                        });

                        const wordsEl = (
                            <span id={ line.id } key={ line.id } style={ styles.line }>
                                { wordsMap }
                            </span>
                        );

                        return (
                            wordsEl
                        );
                    }) }
                </p>
                <div style={ styles.analyseButton }>
                    <FlatButton label="Analyse" primary disabled={ this.state.stillUnalysed } onTouchTap={ this.handleAnalyseClick } />
                </div>
                <div style={ styles.showAnalysis(this.state.showAnalysis) }>
                    <Sortable onSort={ this.handleTokenSort } dynamic>
                        { this.state.rearrangedTokens.map((token, i) => <SortableToken sortData={ { id: token.id, token: token.token } } key={ i }><span style={ assign({ color: getColour(i) }, styles.analysedToken) } key={ i }>{ translit(token.token) }</span></SortableToken>) }
                    </Sortable>
                </div>
                <Popover
                    open={ this.state.wordPopoverOpen }
                    anchorEl={ this.state.anchorEl }
                    anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } }
                    targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                    onRequestClose={ this.handleRequestClose }
                    canAutoPosition
                    autoCloseWhenOffScreen={ false }
                    children={ <WordPopover word={ this.state.word } onSaveWordAnalysis={ this.handleSaveWordAnalysis } onTouchTapCancel={ this.handleCancelWordPopover } /> }
                    />
            </div>
        );
    }
}

const styles = {
    header: {
        borderBottom: `1px solid ${grey500}`
    },
    mainBody: {
        marginTop: 10
    },
    paragraph: {
        fontSize: '1.5em',
        textAlign: 'center'
    },
    line: {
        display: 'flex',
        justifyContent: 'center'
    },
    wordContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 15
    },
    // word: function (analysis) {

    //     const style = {
    //         cursor: 'pointer'
    //     };

    //     if (analysis && analysis.length) {
    //         assign(style, {
    //             backgroundColor: orange500
    //         });
    //     }
    //     // }

    //     return style;
    // },
    word: {
        cursor: 'pointer'
    },
    hovered: {
        backgroundColor: grey300
    },
    emptySpace: {
        margin: '0px -5px'
    },
    popoverStyle: {
        padding: '5px 10px',
        minWidth: 200
    },
    analysedWord: {
        backgroundColor: orange500
    },
    analysedTokens: {
        fontSize: '75%'
    },
    analyseButton: {
        textAlign: 'center'
    },
    analysedToken: {
        padding: 5,
        fontSize: '2em'
    },
    showAnalysis: (show) => {

        const style = {
            marginTop: 40
        };

        if (show) {
            assign(style, {
                display: 'block'
            });
        } else {
            assign(style, {
                display: 'none'
            });
        }
        return style;
    }
};
