import React, { Component, PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ActionBookmark from 'material-ui/svg-icons/action/bookmark';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import { withRouter } from 'react-router';
import { assign, isEmpty, slice, concat, findIndex } from 'lodash';
import { orange500, grey300, grey500 } from 'material-ui/styles/colors';

import PaperCustom from '../shared/PaperCustom';
import ParagraphDialog from './ParagraphDialog';
import { translit } from '../shared/utils';

const defaultEncoding = 'devanagari';

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
        this.handleSettingsTouchTap = this.handleSettingsTouchTap.bind(this);
        this.handleSettingsRequestClose = this.handleSettingsRequestClose.bind(this);
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

    handleSettingsTouchTap(event) {

        event.preventDefault();

        this.setState({
            settingsPopoverOpen: true,
            anchorEl: event.currentTarget
        });
    }

    handleSettingsRequestClose() {

        this.setState({
            settingsPopoverOpen: false
        });
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

        const verses = this.state.document.text.map((verse) => {

            const numLines = verse.lines.length;

            return (
                <p
                    onMouseEnter={ this.handleWordHoveredIn }
                    onMouseLeave={ this.handleWordHoveredOut }
                    onTouchTap={ this.handleWordClicked }
                    data-document-id={ this.state.document.id }
                    data-verse-id={ verse.id }
                    id={ 'p' + verse.id }
                    style={ styles.paragraph(this.state.annotateMode) }
                    key={ verse.id }
                    >
                    {
                        verse.verse.split('\n').map((line, lineIndex) => {

                            const lineEl = numLines === lineIndex + 1 && verse.analysis ?
                                React.Children.toArray([
                                    translit(line.trim(), 'itrans', this.state.encoding),
                                    <ActionBookmark color={ orange500 } style={ styles.analysedIndicator }/>
                                ]) :
                                translit(line.trim(), 'itrans', this.state.encoding);

                            if (lineIndex === 0) {
                                return lineEl;
                            }

                            return React.Children.toArray([
                                <br/>,
                                lineEl
                            ]);
                        })
                    }
                </p>
            );
        });

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row" style={ styles.header }>
                            <div className="col-xs-9">
                                <h1>{ translit(this.state.document.title) }</h1>
                            </div>
                            <div style={ styles.settingsContainer } className="col-xs-3">
                                <FlatButton
                                    label="Settings"
                                    labelPosition="after"
                                    primary
                                    icon={ <ActionSettings /> }
                                    onTouchTap={ this.handleSettingsTouchTap }
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
                    open={ this.state.settingsPopoverOpen }
                    anchorEl={ this.state.anchorEl }
                    onRequestClose={ this.handleSettingsRequestClose }
                    style={ styles.settingsPopover }
                    >
                    <Toggle
                        label="Annotate"
                        onToggle={ this.handleAnnotateToggled }
                        labelPosition="right"
                        style={ styles.annotate }
                        toggled={ this.state.annotateMode }
                        />
                    <Divider style={ styles.divider }/>
                    <RadioButtonGroup onChange={ this.handleEncodingChange } name="encoding" defaultSelected={ this.state.encoding }>
                        <RadioButton
                            value="devanagari"
                            label="देवनागरी"
                            style={ styles.encodingRadioButton }
                        />
                        <RadioButton
                            value="iast"
                            label="Roman"
                            style={ styles.encodingRadioButton }
                        />
                    </RadioButtonGroup>
                </Popover>
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
        marginTop: 10,
        fontFamily: 'Georgia, serif, Siddhanta'
    },
    paragraph: function (isAnnotationMode) {

        const style = {
            padding: '0 5px'
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
    analysedIndicator: {
        float: 'right'
    },
    settingsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    settingsPopover: {
        padding: 10,
        fontSize: '85%'
    },
    encodingRadioButton: {
        marginBottom: 5
    },
    annotate: {
        marginBottom: 10
    },
    divider: {
        margin: '10px 0'
    }
};

export default withRouter(Document);
