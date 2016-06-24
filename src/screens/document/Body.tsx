import * as React from "react";

import Verse from "./Verse";

interface BodyProps {
    text: Array<string>;
    encoding: string;
    documentId: string;
    annotateMode: boolean;
};

export default class Body extends React.Component<BodyProps, any> {
    constructor(props) {

        super(props);
        // this.renderVerse = this.renderVerse.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        const { text, encoding, documentId, annotateMode } = this.props;

        if (text === nextProps.text && encoding === nextProps.encoding && documentId === nextProps.documentId && annotateMode === nextProps.annotateMode) {
            return false;
        }

        return true;
    }

    renderVerse(numVerses, verse, verseIndex) {

        const { documentId, encoding, annotateMode } = this.props;

        return (
            <Verse
                documentId={ documentId }
                verse={ verse }
                encoding={ encoding }
                isLast={ verseIndex === numVerses - 1 }
                isFirst={ verseIndex === 0 }
                key={ verse.id }
                annotateMode={ annotateMode }
                />
        );
    }

    render() {

        const { text } = this.props;

        const numVerses = text.length;

        return (
            <div style={ styles.mainBody }>
                { text.map(this.renderVerse.bind(this, numVerses)) }
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
