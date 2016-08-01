import * as React from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";
import { Paper } from "material-ui";

import { DocumentStore } from "../../stores";
import { Paragraph } from "./Paragraph";

interface SegmentProps {
    segment?: Models.Segment;
    annotateMode: boolean;
    documentStore?: DocumentStore;
}

@inject("documentStore")
@observer
export class Segment extends React.Component<SegmentProps, {}> {
    @observable dialogOpen: boolean;
    @observable dialogText: Models.Stanza;

    @action
    setDialogOpen = (open: boolean) => {

        this.dialogOpen = open;
    }

    @action
    setDialogText = (text: Models.Stanza) => {

        this.dialogText = text;
    }

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

        this.setDialogText(text);
        this.setDialogOpen(true);
    }

    render() {

        const { title, stanzas } = this.props.segment;

        const numParagraphs = stanzas.length;

        return (
            <div>
                { title ? <Paper style={ styles.self }><h2>{ title }</h2></Paper> : null }
                { stanzas.map((paragraph, paragraphIndex) => this.renderParagraph(paragraph, paragraphIndex, numParagraphs)) }
            </div>
        );
    }
}

const styles = {
    self: {
        padding: "5px 20px",
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        boxShadow: "rgba(0, 0, 0, 0.117647) 0px 6px 6px, rgba(0, 0, 0, 0.117647) 0px 6px 6px"
    }
};
