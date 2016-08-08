import * as React from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";
import { Paper } from "material-ui";

import { Stanza } from "./Stanza";

interface SegmentProps {
    segment?: Models.Segment;
}

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
                { stanzas.map((paragraph, paragraphIndex) => {

                    return (
                        <Stanza
                            stanza={ paragraph }
                            isLast={ paragraphIndex === numParagraphs - 1 }
                            key={ paragraph.id }
                            onDialogOpen={ this.handleDialogOpen }
                            />
                    );
                }) }
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
