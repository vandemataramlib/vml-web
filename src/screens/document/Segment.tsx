import * as React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";
import { Paper } from "material-ui";

import { DocumentStore } from "../../stores/documents";
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

    render() {

        const { title, stanzas } = this.props.segment;

        const numParagraphs = stanzas.length;

        return (
            <div>
                <Paper>{ title ? <h2>{ title }</h2> : null }</Paper>
                { stanzas.map((paragraph, paragraphIndex) => this.renderParagraph(paragraph, paragraphIndex, numParagraphs)) }
            </div>
        );
    }
}
