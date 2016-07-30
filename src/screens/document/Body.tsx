import * as React from "react";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { Models } from "vml-common";

import { Paragraph } from "./Paragraph";
import { Segment } from "./Segment";
import { ParagraphDialog } from "./ParagraphDialog";
import { Encoding } from "../../stores/appState";
import { DocumentStore } from "../../stores/documents";

interface BodyProps {
    annotateMode: boolean;
    documentStore?: DocumentStore;
}

@inject("documentStore")
@observer
export class Body extends React.Component<BodyProps, {}> {
    @observable dialogOpen: boolean;
    @observable dialogText: Models.Stanza;

    renderParagraph = (paragraph: Models.Stanza, paragraphIndex: number, numParagraphs: number) => {

        const { documentStore, annotateMode } = this.props;

        return (
            <Paragraph
                stanza={ paragraph }
                isLast={ paragraphIndex === numParagraphs - 1 }
                key={ paragraph.id }
                annotateMode={ annotateMode }
                onDialogOpen={ this.handleDialogOpen }
                />
        );
    }

    handleDialogOpen = (text: Models.Stanza) => {

        this.dialogText = text;
        this.dialogOpen = true;
    }

    handleRequestClose = () => {

        this.dialogOpen = false;
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
        this.dialogText = newText;
    }

    handleSaveParagraphDialog = (updatedText: Models.Stanza) => {

        this.dialogOpen = false;
        this.props.documentStore.updateDocumentText(this.props.documentStore.shownDocument.url, updatedText);
    }

    render() {

        const { documentStore, annotateMode } = this.props;

        if (!documentStore.shownDocument) {
            return null;
        }

        // const text = documentStore.shownDocument.text;
        const segments = (documentStore.shownDocument.contents as Models.IChapter).segments;
        // segments.map(s => s.)
        // const text = (documentStore.shownDocument.contents as Models.IChapter).stanzas;
        // const numParagraphs = text.length;

        return (
            <div style={ styles.mainBody }>
                { segments.map((segment, i) => <Segment segment={ segment } annotateMode={ annotateMode } key={ i } />) }
                { /*text.map((paragraph, paragraphIndex) => this.renderParagraph(paragraph, paragraphIndex, numParagraphs))*/ }
                {
                    /*this.props.annotateMode ?
                        <ParagraphDialog
                            open={ this.dialogOpen }
                            text={ this.dialogText }
                            onRequestClose={ this.handleRequestClose }
                            onSaveWordAnalysis={ (event, lineId, updatedWord) => this.handleSaveWordAnalysis(event, lineId, updatedWord) }
                            onSaveParagraph={ this.handleSaveParagraphDialog }
                            />
                        : null*/
                }
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
