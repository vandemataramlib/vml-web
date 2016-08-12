import * as React from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";
import { Paper } from "material-ui";

import { Stanza } from "./Stanza";

interface SegmentProps {
    segment: Models.Segment;
}

@observer
export class Segment extends React.Component<SegmentProps, {}> {
    render() {

        const { title, stanzas } = this.props.segment;

        const numStanzas = stanzas.length;

        return (
            <div>
                { title ? <Paper style={ styles.self }><h2>{ title }</h2></Paper> : null }
                { stanzas.map((stanza, stanzaIndex) => {

                    return (
                        <Stanza
                            stanza={ stanza }
                            isLast={ stanzaIndex === numStanzas - 1 }
                            key={ stanza.runningId }
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
