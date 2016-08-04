import * as React from "react";
import { Dialog, Popover, FlatButton, LinearProgress } from "material-ui";
const Sortable = require("react-anything-sortable");
import { grey300, grey500, orange500 } from "material-ui/styles/colors";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";
import { translit, getColour, getLightColour } from "../../shared/utils";
import { Models } from "vml-common";

import { AppState, StanzaStore, DocumentStore } from "../../stores";
import { SortableToken } from "./SortableToken";
import { WordPopover } from "./WordPopover";
import { Line } from "./Line";

interface ParagraphDialogProps {
    open: boolean;
    stanza: Models.Stanza;
    onRequestClose: React.EventHandler<any>;
    onSaveParagraph: any;
    runningStanzaId: string;
    appState?: AppState;
    stanzaStore?: StanzaStore;
    documentStore?: DocumentStore;
}

@inject("appState", "stanzaStore", "documentStore")
@observer
export class ParagraphDialog extends React.Component<ParagraphDialogProps, {}> {
    @observable wordPopoverOpen: boolean;
    @observable anchorEl: any;
    @observable word: Models.Word;
    rearrangedTokens: Models.Token[] = [];
    @observable analyseClicked: boolean;

    @action
    setWordPopoverOpen = (open: boolean) => {

        this.wordPopoverOpen = open;
    }

    @action
    setAnchorEl = (anchorEl: any) => {

        this.anchorEl = anchorEl;
    }

    @action
    setAnalyseClicked = (clicked: boolean) => {

        this.analyseClicked = clicked;
    }

    updateStanza = () => {

        const { stanzaStore, documentStore } = this.props;
        const { editedStanza } = this.props.appState;
        editedStanza.analysis = this.rearrangedTokens;
        stanzaStore.updateStanza(documentStore.shownDocument.url, editedStanza.runningId, editedStanza);
        this.props.onSaveParagraph();
    }

    componentWillReceiveProps() {

        this.setAnalyseClicked(false);
        this.rearrangedTokens = [];
    }

    getDialogActions(): JSX.Element[] {

        return [
            <FlatButton
                label="Cancel"
                secondary
                onTouchTap={ this.props.onRequestClose }
                />,
            <FlatButton
                label="Save"
                primary
                // disabled
                onTouchTap={ this.updateStanza }
                />
        ];
    }

    handleAnalyseClick = () => {

        const analysedTokens: Models.Token[] = [];

        this.props.appState.editedStanza.lines.forEach(line => {

            line.words.forEach(word => {

                word.analysis.forEach(token => {

                    analysedTokens.push(token);
                });
            });
        });
        this.setAnalyseClicked(true);
        this.rearrangedTokens = analysedTokens;
    }

    isAnalysedDisabled() {

        const lineWithoutAnalysis = this.props.appState.editedStanza.lines.some(line => {

            const wordWithoutAnalysis = line.words.some(word => !word.analysis ? true : false);
            return wordWithoutAnalysis ? true : false;
        });

        return lineWithoutAnalysis;
    }

    getAnalysedWords() {

        const { editedStanza } = this.props.appState;

        if (!this.analyseClicked && !editedStanza.analysis) {
            return [];
        }

        const analysedTokens: Models.Token[] = [];

        if (editedStanza.analysis && !this.analyseClicked) {
            editedStanza.analysis.forEach(token => {

                analysedTokens.push(token);
            });
        }
        else {
            editedStanza.lines.forEach(line => {

                line.words.forEach(word => {

                    word.analysis.forEach(token => {

                        analysedTokens.push(token);
                    });
                });
            });
        }

        return analysedTokens;
    }

    handleTokenSort = (tokens: Models.Token[]) => {

        this.rearrangedTokens = tokens;
    }

    getDialogChildren() {

        const { appState } = this.props;

        return (
            <div>
                <p style={ styles.paragraph }>
                    {
                        appState.editedStanza.lines.map((line, lineIndex) => {
                            return lineIndex > 0 ?
                                React.Children.toArray([
                                    <br />,
                                    <Line line={ line } onWordClicked={ this.handleWordClicked } key={ line.id }/>
                                ])
                                : <Line line={ line } onWordClicked={ this.handleWordClicked } key={ line.id }/>;
                        })
                    }
                </p>
                <div style={ styles.analyseButton }>
                    <FlatButton label="Analyse" primary disabled={ this.isAnalysedDisabled() } onTouchTap={ this.handleAnalyseClick } />
                </div>
                <div style={ styles.showAnalysis(this.analyseClicked || appState.editedStanza.analysis) }>
                    <Sortable onSort={ this.handleTokenSort } dynamic>
                        {
                            this.getAnalysedWords().map((token, tokenIndex) => {

                                return (
                                    <SortableToken sortData={ token } key={ tokenIndex }>
                                        <span style={ Object.assign({ backgroundColor: getLightColour(tokenIndex) }, styles.analysedToken) } >
                                            { translit(token.token) }
                                        </span>
                                    </SortableToken>
                                );
                            })
                        }
                    </Sortable>
                </div>
            </div>
        );
    }

    handleRequestClose = (event) => {

        if (this.wordPopoverOpen) {
            return;
        }

        this.props.onRequestClose(event);
    }

    handleRequestPopoverClose = () => {

        this.setWordPopoverOpen(false);
    }

    handleWordClicked = (event: React.TouchEvent) => {

        event.preventDefault();
        this.setAnchorEl(event.currentTarget);
        this.setWordPopoverOpen(true);
    }

    handleProcessWordAnalysis = (event) => {

        this.setWordPopoverOpen(false);
        this.props.appState.unsetEditedWord();
    }

    render() {

        if (!this.props.stanza) {
            return (
                <div>
                    <Dialog
                        title={ `Verse ${this.props.runningStanzaId}` }
                        open={ this.props.open }
                        contentStyle={ styles.dialogStyle }
                        bodyStyle={ styles.dialogBodyStyle }
                        children={ <LinearProgress mode="indeterminate" /> }
                        />
                </div>
            );
        }

        const { appState } = this.props;

        appState.setEditedStanza(this.props.stanza);

        return (
            <div>
                <Dialog
                    title={ `Verse ${appState.editedStanza.runningId}` }
                    open={ this.props.open }
                    onRequestClose={ this.handleRequestClose }
                    contentStyle={ styles.dialogStyle }
                    actions={ this.getDialogActions() }
                    autoScrollBodyContent
                    children={ this.getDialogChildren() }
                    bodyStyle={ styles.dialogBodyStyle }
                    />
                <Popover
                    open={ this.wordPopoverOpen }
                    anchorEl={ this.anchorEl }
                    anchorOrigin={ { horizontal: "left", vertical: "top" } }
                    targetOrigin={ { horizontal: "right", vertical: "center" } }
                    onRequestClose={ this.handleRequestPopoverClose }
                    canAutoPosition
                    autoCloseWhenOffScreen={ false }
                    children={
                        <WordPopover
                            word={ appState.editedWord }
                            onSaveWordAnalysis={ this.handleProcessWordAnalysis }
                            onTouchTapCancel={ this.handleRequestPopoverClose }
                            />
                    }
                    />
            </div>
        );
    }
}

const styles = {
    paragraph: {
        fontSize: "1.5em",
        textAlign: "center"
    },
    analyseButton: {
        textAlign: "center"
    },
    analysedToken: {
        padding: 5,
        fontSize: "1.75em",
        margin: 5
    },
    showAnalysis: (show) => {

        const style = {
            marginTop: 24,
            padding: "0 40px",
            lineHeight: "3em"
        };

        if (show) {
            Object.assign(style, {
                display: "flex",
                flexWrap: "wrap"
            });
        } else {
            Object.assign(style, {
                display: "none"
            });
        }
        return style;
    },
    dialogStyle: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0
    },
    dialogBodyStyle: {
        color: "inherit",
        paddingBottom: 20
    }
};
