import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { slice, concat, findIndex } from 'lodash';

import Header from './Header';
import Body from './Body';

const defaultEncoding = 'devanagari';

export class Document extends Component {
    constructor(props) {

        super(props);
        this.handleAnnotateToggle = this.handleAnnotateToggle.bind(this);
        this.handleWordClicked = this.handleWordClicked.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleSaveAnalysis = this.handleSaveAnalysis.bind(this);
        this.handleCancelWordPopover = this.handleCancelWordPopover.bind(this);
        this.handleEncodingChange = this.handleEncodingChange.bind(this);
        this.state = {
            document: {},
            annotateMode: false,
            wordPopoverOpen: false,
            selected: {},
            settingsPopoverOpen: false,
            encoding: defaultEncoding
        };
    }

    componentDidMount() {

        const documentTitleSlug = this.props.params.title;
        const documents = localStorage.getItem('documents');
        const document = JSON.parse(documents).find((doc) => doc.slug === documentTitleSlug);
        const encoding = localStorage.getItem('encoding') || defaultEncoding;
        this.setState({
            document,
            encoding
        });
    }

    componentWillReceiveProps(nextProps) {

        const documentTitleSlug = nextProps.params.title;
        const documents = localStorage.getItem('documents');
        const document = JSON.parse(documents).find((doc) => doc.slug === documentTitleSlug);
        this.state.document = document;
    }

    handleAnnotateToggle(event, value) {

        this.setState({
            annotateMode: value
        });
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

    handleEncodingChange(event, value) {

        localStorage.setItem('encoding', value);

        this.setState({
            encoding: value
        });
    }

    render() {

        if (!this.state.document.text) {
            return null;
        }

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <Header
                        documentTitle={ this.state.document.title }
                        onSettingsTouchTap={ this.handleSettingsTouchTap }
                        onAnnotateToggle={ this.handleAnnotateToggle }
                        annotateMode={ this.state.annotateMode }
                        onEncodingChange={ this.handleEncodingChange }
                        encoding={ this.state.encoding }
                        />
                    <Body
                        text={ this.state.document.text }
                        encoding={ this.state.encoding }
                        documentId={ this.state.document.id }
                        annotateMode={ this.state.annotateMode }
                        />
                </div>
            </div>
        );
    }
}

// const styles = {
//     paragraph: function (isAnnotationMode) {

//         const style = {
//             padding: '0 5px'
//         };

//         if (isAnnotationMode) {
//             assign(style, {
//                 cursor: 'pointer'
//             });
//         }

//         return style;
//     },
//     emptySpace: {
//         margin: '0px -5px'
//     }
// };

export default withRouter(Document);
