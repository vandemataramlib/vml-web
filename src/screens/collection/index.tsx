import * as React from "react";
import { observer, inject } from "mobx-react";
import { Link } from "react-router";
import { Models } from "vml-common";
import { grey500 } from "material-ui/styles/colors";

import { Context } from "../../shared/interfaces";
import { CollectionStore, AppState } from "../../stores";
import { PaperCustom } from "../shared/PaperCustom";
import { translit } from "../../shared/utils";
import { Encoding } from "../../shared/interfaces";
import { defaultEncoding } from "../../shared/constants";

interface CollectionProps {
    params: any;
    collectionStore?: CollectionStore;
    appState?: AppState;
}

const doFetchData = (context: Context | CollectionProps, props: CollectionProps) => {

    return context.collectionStore.getCollection(props.params.id);
};

@inject("collectionStore", "appState")
@observer
export class Collection extends React.Component<CollectionProps, {}> {
    static fetchData(context: Context, props: any) {

        return doFetchData(context, props);
    }

    componentDidMount() {

        doFetchData(this.props, this.props);
    }

    componentWillReceiveProps(nextProps) {

        doFetchData(nextProps, nextProps);
    }

    renderLine = (line: Models.Line, lineIndex: number, stanzaLength: number, runningId: string): any => {

        const { appState } = this.props;

        let newLine = "";

        if (stanzaLength - 1 === lineIndex) {
            newLine += `${line.line} ||${runningId}||`;
        }
        else {
            newLine += `${line.line} |`;
        }

        let lineEl = translit(newLine, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]);

        if (lineIndex === 0) {
            return lineEl;
        }

        return React.Children.toArray([
            <br/>,
            lineEl
        ]);
    }

    renderStanza = (stanza: Models.CollectionStanza, index: number, numStanzas: number) => {

        const stanzaLength = stanza.lines.length;

        return (
            <div style={ styles.stanza } key={ index.toString() }>
                <p>
                    {
                        stanza.lines.map((line, lineIndex) => this.renderLine(line, lineIndex, stanzaLength, stanza.runningId))
                    }
                </p>
                <div style={ styles.reference(numStanzas, index) }><Link to={ stanza.originalUrl }>{ translit(stanza.referenceTitle) }</Link></div>
                {
                    numStanzas - 1 > index ? <div style={ styles.separator }>*</div> : null
                }
            </div>
        );
    };

    renderSegment = (segment: Models.CollectionSegment) => {

        const numStanzas = segment.stanzas.length;

        return (
            <div style={ styles.segment } key={ segment.id }>
                {
                    segment.stanzas.map((stanza, index) => this.renderStanza(stanza, index, numStanzas))
                }
            </div>
        );
    }

    render() {

        const { params, collectionStore } = this.props;

        if (!collectionStore.shownCollectionId) {
            return null;
        }

        const { shownCollection } = collectionStore;

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row">
                            <div className="col-xs-12">
                                <div style={ styles.self }>
                                    <h1>{ shownCollection.title }</h1>
                                    <hr />
                                    {
                                        shownCollection.description &&
                                        <div>
                                            <div style={ styles.description }>{ shownCollection.description }</div>
                                            <hr />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-xs-12">
                                {
                                    shownCollection.segments.map(this.renderSegment)
                                }
                            </div>
                        </div>
                    </PaperCustom>
                </div>
            </div>
        );
    }
}

const styles = {
    self: {
        padding: "20px 0"
    },
    description: {
        padding: "10px 0"
    },
    segment: {
        fontFamily: "Monotype Sabon, serif, Siddhanta"
    },
    stanza: {
        display: "flex",
        flexDirection: "column"
    },
    reference: (numStanzas: number, index: number) => {

        return {
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: numStanzas - 1 === index ? 40 : 0
        };
    },
    separator: {
        display: "flex",
        justifyContent: "center",
        color: grey500,
        fontSize: "1.5em"
    }
};
