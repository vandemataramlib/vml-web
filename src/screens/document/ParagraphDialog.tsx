import * as React from "react";
import { Dialog, Popover, FlatButton } from "material-ui";
import { Sortable } from "react-anything-sortable";
import { grey300, grey500, orange500 } from "material-ui/styles/colors";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";
import { translit, getColour, getLightColour } from "../../shared/utils";
import { Models } from "vml-common";

import { DocumentStore } from "../../stores";
import { SortableToken } from "./SortableToken";
import { WordPopover } from "./WordPopover";
import { Line } from "./Line";

interface ParagraphDialogProps {
    open: boolean;
    text: Models.Stanza;
    onRequestClose: React.EventHandler<any>;
    onSaveWordAnalysis: any;
    onSaveParagraph: any;
}

@observer
export class ParagraphDialog extends React.Component<ParagraphDialogProps, {}> {
    @observable wordPopoverOpen: boolean;
    @observable anchorEl: any;
    @observable word: Models.Word;
    lineId: string;
    rearrangedTokens: Models.Token[] = [];
    @observable allWordsAnalysed: boolean;
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
    setWord = (word: Models.Word) => {

        this.word = word;
    }

    @action
    setAnalyseClicked = (clicked: boolean) => {

        this.analyseClicked = clicked;
    }

    prepareParagraphSave = () => {

        const updatedText: Models.Stanza = Object.assign({}, this.props.text);
        updatedText.analysis = this.rearrangedTokens;
        this.props.onSaveParagraph(updatedText);
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
                onTouchTap={ this.prepareParagraphSave }
                />
        ];
    }

    handleAnalyseClick = () => {

        const analysedTokens: Models.Token[] = [];

        this.props.text.lines.forEach(line => {

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

        const lineWithoutAnalysis = this.props.text.lines.some(line => {

            const wordWithoutAnalysis = line.words.some(word => !word.analysis ? true : false);
            return wordWithoutAnalysis ? true : false;
        });

        return lineWithoutAnalysis;
    }

    getAnalysedWords() {

        if (!this.analyseClicked && !this.props.text.analysis) {
            return [];
        }

        const analysedTokens: Models.Token[] = [];

        if (this.props.text.analysis && !this.analyseClicked) {
            this.props.text.analysis.forEach(token => {

                analysedTokens.push(token);
            });
        }
        else {
            this.props.text.lines.forEach(line => {

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

        return (
            <div>
                <p style={ styles.paragraph }>
                    {
                        this.props.text.lines.map((line, lineIndex) => {
                            return lineIndex > 0 ?
                                React.Children.toArray([
                                    <br />,
                                    <Line line={ line } onWordClicked={ (event, lineId, word) => this.handleWordClicked(event, lineId, word) } key={ line.id }/>
                                ])
                                : <Line line={ line } onWordClicked={ (event, lineId, word) => this.handleWordClicked(event, lineId, word) } key={ line.id }/>;
                        })
                    }
                </p>
                <div style={ styles.analyseButton }>
                    <FlatButton label="Analyse" primary disabled={ this.isAnalysedDisabled() } onTouchTap={ this.handleAnalyseClick } />
                </div>
                <div style={ styles.showAnalysis(this.analyseClicked || this.props.text.analysis) }>
                    <Sortable onSort={ this.handleTokenSort } dynamic>
                        {
                            this.getAnalysedWords().map((token, tokenIndex) => {

                                return (
                                    <SortableToken sortData={ token } key={ tokenIndex }>
                                        <span style={ Object.assign({ backgroundColor: getLightColour(tokenIndex) }, styles.analysedToken) } key={ tokenIndex }>{ translit(token.token) }</span>
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

    handleWordClicked = (event: React.TouchEvent, lineId: string, word: Models.Word) => {

        event.preventDefault();
        this.setWord(word);
        this.setAnchorEl(event.currentTarget);
        this.setWordPopoverOpen(true);
        this.lineId = lineId;
    }

    handleProcessWordAnalysis = (event, updatedWord: Models.Word) => {

        this.setWordPopoverOpen(false);
        this.props.onSaveWordAnalysis(event, this.lineId, updatedWord);
    }

    render() {

        if (!this.props.text) {
            return null;
        }

        return (
            <div>
                <Dialog
                    title={ `Verse ${this.props.text.id}` }
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
                            word={ this.word }
                            onSaveWordAnalysis={ (event, updatedWord) => this.handleProcessWordAnalysis(event, updatedWord) }
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
        color: "inherit"
    }
};
