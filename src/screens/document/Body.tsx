import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";

import { Paragraph } from "./Paragraph";
import { ParagraphDialog } from "./ParagraphDialog";
import { Encoding } from "../../stores/appState";
import { DocumentStore, Text, Word, Line } from "../../stores/documents";

interface BodyProps {
    annotateMode: boolean;
    documentStore?: DocumentStore;
}

@observer(["documentStore"])
export class Body extends React.Component<BodyProps, {}> {
    @observable dialogOpen: boolean;
    @observable dialogText: Text;

    renderParagraph = (paragraph: Text, paragraphIndex: number, numParagraphs: number) => {

        const { documentStore, annotateMode } = this.props;

        return (
            <Paragraph
                text={ paragraph }
                isLast={ paragraphIndex === numParagraphs - 1 }
                key={ paragraph.id }
                annotateMode={ annotateMode }
                onDialogOpen={ this.handleDialogOpen }
                />
        );
    }

    handleDialogOpen = (text: Text) => {

        this.dialogText = text;
        this.dialogOpen = true;
    }

    handleRequestClose = () => {

        this.dialogOpen = false;
    }

    handleSaveWordAnalysis = (event, lineId, updatedWord: Word) => {

        let newText: Text = Object.assign({}, this.dialogText);

        newText.lines = newText.lines.map(line => {

            const newLine: Line = Object.assign({}, line);

            if (newLine.id === lineId) {
                let newWords: Word[] = Object.assign({}, newLine.words);
                newWords = newLine.words.map(word => {

                    let newWord: Word = Object.assign({}, word);

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

    handleSaveParagraphDialog = (updatedText: Text) => {

        this.dialogOpen = false;
        this.props.documentStore.updateDocumentText(this.props.documentStore.shownDocument.slug, updatedText);
    }

    render() {

        const { documentStore } = this.props;

        if (!documentStore.shownDocument) {
            return null;
        }

        const text = documentStore.shownDocument.text;
        const numParagraphs = text.length;

        return (
            <div style={ styles.mainBody }>
                { text.map((paragraph, paragraphIndex) => this.renderParagraph(paragraph, paragraphIndex, numParagraphs)) }
                {
                    this.props.annotateMode ?
                        <ParagraphDialog
                            open={ this.dialogOpen }
                            text={ this.dialogText }
                            onRequestClose={ this.handleRequestClose }
                            onSaveWordAnalysis={ (event, lineId, updatedWord) => this.handleSaveWordAnalysis(event, lineId, updatedWord) }
                            onSaveParagraph={ this.handleSaveParagraphDialog }
                            />
                        : null
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
