import * as React from "react";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";

import { Stanza } from "./Stanza";
import { Segment } from "./Segment";
import { StanzaDialog } from "./StanzaDialog";
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

    handleRequestClose = () => {

        const { appState } = this.props;

        appState.closeStanzaDialog();
        appState.deleteEditedStanza();
    }

    componentWillReceiveProps() {

        this.handleRequestClose();
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
                    <StanzaDialog
                        open={ loadingStanzaDialog !== null }
                        stanza={ loadingStanzaDialog ? stanzaStore.getStanzaFromURL(loadingStanzaDialog.stanzaURL) : null }
                        onRequestClose={ this.handleRequestClose }
                        onSaveParagraph={ this.handleRequestClose }
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
