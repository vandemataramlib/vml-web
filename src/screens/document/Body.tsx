import * as React from "react";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";
import { Models } from "vml-common";

import { Paragraph } from "./Paragraph";
import { Segment } from "./Segment";
import { ParagraphDialog } from "./ParagraphDialog";
import { DocumentStore, AppState, StanzaStore } from "../../stores";

interface BodyProps {
    annotateMode: boolean;
    documentStore?: DocumentStore;
    appState?: AppState;
    stanzaStore?: StanzaStore;
}

@inject("documentStore", "appState", "stanzaStore")
@observer
export class Body extends React.Component<BodyProps, {}> {
    @observable dialogOpen: boolean;
    @observable dialogText: Models.Stanza;

    // @action
    // setDialogOpen = (open: boolean) => {

    //     this.dialogOpen = open;
    // }

    // @action
    // setDialogText = (text: Models.Stanza) => {

    //     this.dialogText = text;
    // }

    // renderParagraph = (paragraph: Models.Stanza, paragraphIndex: number, numParagraphs: number) => {

    //     const { documentStore, annotateMode } = this.props;

    //     return (
    //         <Paragraph
    //             stanza={ paragraph }
    //             isLast={ paragraphIndex === numParagraphs - 1 }
    //             key={ paragraph.id }
    //             annotateMode={ annotateMode }
    //             onDialogOpen={ this.handleDialogOpen }
    //             />
    //     );
    // }

    // handleDialogOpen = (text: Models.Stanza) => {

    //     this.setDialogText(text);
    //     this.setDialogOpen(true);
    // }

    handleRequestClose = () => {

        this.props.appState.closeStanzaDialog();
    }

    handleSaveWordAnalysis = (event, lineId, updatedWord: Models.Word) => {

        let newText: Models.Stanza = Object.assign({}, this.dialogText);

        newText.lines = newText.lines.map(line => {

            const newLine: Models.Line = Object.assign({}, line);

            if (newLine.id === lineId) {
                let newWords: Models.Word[] = Object.assign({}, newLine.words);
                newWords = newLine.words.map(word => {

                    let newWord: Models.Word = Object.assign({}, word);

                    if (word.id === updatedWord.id) {
                        newWord.analysis = updatedWord.analysis;
                    }

                    return newWord;
                });

                newLine.words = newWords;
            }
            return newLine;
        });
        // this.setDialogText(newText);
    }

    handleSaveParagraphDialog = (updatedText: Models.Stanza) => {

        // // this.setDialogOpen(false);
        // const { appState } = this.props;
        // appState.closeStanzaDialog();
        // this.props.documentStore.updateDocumentText(this.props.documentStore.shownDocument.url, updatedText);
    }

    render() {

        const { documentStore, annotateMode, appState, stanzaStore } = this.props;

        if (!documentStore.shownDocument) {
            return null;
        }

        const segments = (documentStore.shownDocument.contents as Models.IChapter).segments;

        const loadingStanzaDialog = appState.loadingStanzaDialog;

        return (
            <div style={ styles.mainBody }>
                { segments.map((segment, i) => <Segment segment={ segment } annotateMode={ annotateMode } key={ i } />) }
                { this.props.annotateMode ?
                    <ParagraphDialog
                        open={ loadingStanzaDialog !== null }
                        stanza={ loadingStanzaDialog ? stanzaStore.getStanzaFromURL(loadingStanzaDialog.stanzaURL) : null }
                        onRequestClose={ this.handleRequestClose }
                        onSaveWordAnalysis={ (event, lineId, updatedWord) => this.handleSaveWordAnalysis(event, lineId, updatedWord) }
                        onSaveParagraph={ this.handleSaveParagraphDialog }
                        runningStanzaId={ loadingStanzaDialog ? loadingStanzaDialog.runningId : null }
                        />
                    : null}
            </div>
        );
    }
}

const styles = {
    mainBody: {
        boxSizing: "border-box",
        WebkitBoxSizing: "border-box"
        // marginTop: 10
        // position: 'relative'
    }
};
