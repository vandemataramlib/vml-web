import React, { Component, PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Sanscript from 'sanscript';
import { withRouter } from 'react-router';
import { assign } from 'lodash';
import { grey300, grey500 } from 'material-ui/styles/colors';

import PaperCustom from '../shared/PaperCustom';
import WordPopover from './WordPopover';
import { translit } from '../shared/utils';

export class Document extends Component {
    constructor(props) {

        super(props);
        // this.handleAnnotateClicked = this.handleAnnotateClicked.bind(this);
        this.handleAnnotateToggled = this.handleAnnotateToggled.bind(this);
        this.handleWordClicked = this.handleWordClicked.bind(this);
        this.handleWordHoveredIn = this.handleWordHoveredIn.bind(this);
        this.handleWordHoveredOut = this.handleWordHoveredOut.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleSaveTap = this.handleSaveTap.bind(this);
        this.handleCancelWordPopover = this.handleCancelWordPopover.bind(this);
        this.state = {
            document: {},
            annotateMode: false,
            wordPopoverOpen: false
        };
    }

    componentWillMount() {

        const documentTitleSlug = this.props.params.title;
        const document = localStorage.getItem(documentTitleSlug);
        this.setState({
            document: JSON.parse(document)
        });
    }

    componentWillUpdate(nextProps) {

        const documentTitleSlug = nextProps.params.title;
        const document = localStorage.getItem(documentTitleSlug);
        this.state.document = JSON.parse(document);
    }

    handleAnnotateToggled(event, value) {

        this.setState({
            annotateMode: value
        });
    }

    handleWordHoveredIn(event) {

        if (this.state.annotateMode) {
            event.target.style.backgroundColor = styles.hovered.backgroundColor;
        }
    }

    handleWordHoveredOut(event) {

        if (this.state.annotateMode) {
            event.target.style.backgroundColor = null;
        }
    }

    handleWordClicked(event, value) {

        if (this.state.annotateMode) {
            event.preventDefault();
            const word = event.target.attributes['data-word'].value;
            const wordId = event.target.attributes['data-word-id'].value;
            this.setState({
                wordPopoverOpen: true,
                anchorEl: event.currentTarget,
                word: { word, wordId }
            });
        }
    }

    handleRequestClose() {

        this.setState({
            wordPopoverOpen: false,
            word: null
        });
    }

    getPopoverContent() {

        if (!this.state.word) {
            return null;
        }
        return (
            <div style={ styles.popoverStyle }>
                <h3>{ translit(this.state.word.word) }</h3>
                <TextField id="itrans-word" defaultValue={ this.state.word.word } />
                <div className="row">
                    <div className="col-xs-12" style={ styles.createButton }>
                        <FlatButton label="Save" primary onTouchTap={ this.handleSaveTap } />
                        <FlatButton label="Cancel" secondary onTouchTap={ this.handleCancelWordPopover } />
                    </div>
                </div>
            </div>
        );
    }

    handleSaveTap() {

        console.log('save');
    }

    handleCancelWordPopover(event) {

        this.handleRequestClose(event);
    }

    render() {

        const verses = this.state.document.text.map((verse) => {

            const numLines = verse.lines.length;

            return (
                <p id={ 'p' + verse.id } key={ verse.id }>
                    { verse.lines.map((line, lineIndex) => {

                        let verseId = '';
                        if (numLines === lineIndex + 1) {
                            verseId = ` ||${verse.id}||`;
                        }

                        const wordsMap = line.words.map((word, wordIndex) => {

                            const wordEl = (
                                <span
                                    data-word={ word.word }
                                    data-word-id={ word.id }
                                    onMouseOver={ this.handleWordHoveredIn }
                                    onMouseOut={ this.handleWordHoveredOut }
                                    onTouchTap={ this.handleWordClicked }
                                    style={ styles.paragraph(this.state.annotateMode) }
                                    key={ word.id }
                                    >
                                    { translit(word.word) }
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
                            <span id={ line.id } key={ line.id }>
                                { wordsMap }
                            </span>
                        );

                        return (
                            lineIndex === 0 ?
                                wordsEl :
                                React.Children.toArray([
                                    <br/>,
                                    wordsEl
                                ])
                        );
                    }) }
                </p>
            );
        });

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row" style={ styles.header }>
                            <div className="col-xs-10">
                                <h1>{ translit(this.state.document.title) }</h1>
                            </div>
                            <div className="col-xs-2">
                                <Toggle
                                    label="Annotate"
                                    onToggle={ this.handleAnnotateToggled }
                                    labelPosition="right"
                                    />
                            </div>
                        </div>
                        <div className="row" style={ styles.mainBody }>
                            <div className="col-xs-12">
                                { verses }
                            </div>
                        </div>
                    </PaperCustom>
                </div>
                <Popover
                    open={ this.state.wordPopoverOpen }
                    anchorEl={ this.state.anchorEl }
                    anchorOrigin={ { horizontal: 'left', vertical: 'top' } }
                    targetOrigin={ { horizontal: 'left', vertical: 'top' } }
                    onRequestClose={ this.handleRequestClose }
                    canAutoPosition
                    autoCloseWhenOffScreen={ false }
                    children={ <WordPopover word={ this.state.word } onTouchTapSave={ this.handleSaveTap } onTouchTapCancel={ this.handleCancelWordPopover } /> }
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
    paragraph: function (isAnnotationMode) {

        const style = {
            padding: 5
        };

        if (isAnnotationMode) {
            assign(style, {
                cursor: 'pointer'
            });
        }

        return style;
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
    }
};

export default withRouter(Document);

