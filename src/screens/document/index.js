import React, { Component, PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import { assign, isEmpty, slice, concat, findIndex } from 'lodash';
import { grey300, grey500 } from 'material-ui/styles/colors';

import PaperCustom from '../shared/PaperCustom';
import ParagraphDialog from './ParagraphDialog';
import { translit } from '../shared/utils';

export class Document extends Component {
    constructor(props) {

        super(props);
        this.handleAnnotateToggled = this.handleAnnotateToggled.bind(this);
        this.handleWordClicked = this.handleWordClicked.bind(this);
        this.handleWordHoveredIn = this.handleWordHoveredIn.bind(this);
        this.handleWordHoveredOut = this.handleWordHoveredOut.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleSaveAnalysis = this.handleSaveAnalysis.bind(this);
        this.handleCancelWordPopover = this.handleCancelWordPopover.bind(this);
        this.state = {
            document: {},
            annotateMode: false,
            wordPopoverOpen: false,
            selected: {}
        };
    }

    componentWillMount() {

        const documentTitleSlug = this.props.params.title;
        const documents = localStorage.getItem('documents');
        const document = JSON.parse(documents).find((doc) => doc.slug === documentTitleSlug);
        this.setState({
            document
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
            const docId = event.target.attributes['data-document-id'].value;
            const verseId = event.target.attributes['data-verse-id'].value;
            this.setState({
                wordPopoverOpen: true,
                selected: { docId, verseId }
            });
        }
    }

    handleRequestClose() {

        this.setState({
            wordPopoverOpen: false,
            word: null
        });
    }

    handleSaveAnalysis(selected, updatedVerse, event) {

        const documents = JSON.parse(localStorage.getItem('documents'));
        const document = documents.find((doc) => doc.id === selected.docId);
        const verseIndex = selected.verseId - 1;
        const updatedDocumentText = concat([], slice(document.text, 0, verseIndex), updatedVerse, slice(document.text, verseIndex + 1));
        document.text = updatedDocumentText;
        const documentIndex = findIndex(documents, (doc) => doc.id === selected.docId);
        const updatedDocuments = concat([], slice(documents, 0, documentIndex), document, slice(documents, documentIndex + 1));
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        this.handleRequestClose(event);
        this.setState({
            document
        });
    }

    handleCancelWordPopover(event) {

        this.handleRequestClose(event);
    }


    render() {

        const verses = this.state.document.text.map((verse) => {

            // const numLines = verse.lines.length;

            return (
                <p
                    onMouseEnter={ this.handleWordHoveredIn }
                    onMouseLeave={ this.handleWordHoveredOut }
                    onTouchTap={ this.handleWordClicked }
                    data-document-id={ this.state.document.id }
                    data-verse-id={ verse.id }
                    id={ 'p' + verse.id }
                    style={ styles.paragraph(this.state.annotateMode, verse.analysis) }
                    key={ verse.id }
                    dangerouslySetInnerHTML={ { __html: verse.verse.split('\n').map((line) => translit(line.trim())).join('<br />') } }
                    />
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
                {
                    !isEmpty(this.state.selected) ? <ParagraphDialog
                        selected={ this.state.selected }
                        open={ this.state.wordPopoverOpen }
                        onRequestClose={ this.handleRequestClose }
                        onSave={ this.handleSaveAnalysis }
                        /> : null
                }
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
    paragraph: function (isAnnotationMode, analysed) {

        const style = {
            padding: 5
        };

        if (isAnnotationMode) {
            assign(style, {
                cursor: 'pointer'
            });
        }

        if (analysed) {
            assign(style, {
                backgroundColor: grey300
            });
        }

        return style;
    },
    hovered: {
        backgroundColor: grey300
    },
    emptySpace: {
        margin: '0px -5px'
    }
};

export default withRouter(Document);
