import * as React from "react";
import { Paper, LinearProgress } from "material-ui";
import { HardwareKeyboardArrowDown, HardwareKeyboardArrowUp } from "material-ui/svg-icons";
import { orange100, orange500 } from "material-ui/styles/colors";
import { observer, inject } from "mobx-react";
import { observable, transaction, action } from "mobx";
import { Models } from "vml-common";

import { translit } from "../../shared/utils";
import { AppState, DocumentStore, StanzaStore } from "../../stores";
import { Encoding } from "../../shared/interfaces";
import { defaultEncoding } from "../../shared/constants";

interface StanzaProps {
    stanza: Models.Stanza;
    annotateMode: boolean;
    isLast: boolean;
    appState?: AppState;
    onDialogOpen: React.EventHandler<any>;
    documentStore?: DocumentStore;
    stanzaStore?: StanzaStore;
};

@inject("appState", "documentStore", "stanzaStore")
@observer
export class Stanza extends React.Component<StanzaProps, {}> {
    @observable hovered: boolean = false;
    @observable expanded: boolean = false;

    @action
    setHovered = (hovered: boolean) => {

        this.hovered = hovered;
    }

    @action
    setExpanded = (expanded: boolean) => {

        this.expanded = expanded;
    }

    componentWillReceiveProps() {

        this.setExpanded(false);
    }

    handleMouseEnter = (event) => {

        this.setHovered(true);
    }

    handleMouseLeave = (event) => {

        this.setHovered(false);
    }

    handleVerseClick = (event: React.MouseEvent, runningStanzaId: string) => {

        this.setExpanded(!this.expanded);
    }

    handleAnnotateParagraph = (stanza: Models.Stanza, event) => {

        if (!this.props.annotateMode) {
            return;
        }

        event.preventDefault();

        const { appState, documentStore, stanzaStore } = this.props;

        stanzaStore.getStanza(documentStore.shownDocument.url, stanza.runningId);

        appState.openStanzaDialog(documentStore.shownDocument.url, stanza.runningId);
    }

    renderPara = (line: Models.Line, lineIndex, stanzaRunningId: string, stanzaLength: number): string | (React.ReactElement<any> | string | number)[] => {

        const { appState } = this.props;

        let lineEl = translit(line.line, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]);

        if (stanzaLength - 1 === lineIndex) {
            lineEl += " ||" + translit(stanzaRunningId, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value]) + "||";
        }

        if (lineIndex === 0) {
            return lineEl;
        }

        return React.Children.toArray([
            <br/>,
            lineEl
        ]);
    }

    render() {

        const { stanza, stanzaStore, documentStore } = this.props;

        const getStanza = (url: string, runningStanzaId: string) => {

            const stanza = stanzaStore.getStanza(url, runningStanzaId);

            if (!stanza) {
                return <LinearProgress mode="indeterminate" style={ styles.loadProgress } />;
            }

            return <div>{ stanza.stanza }</div>;
        };

        return (
            <div id={ "p" + stanza.id } style={ stanza.analysis && !this.expanded && this.props.annotateMode ? { borderRight: `2px solid ${orange500}` } : null }>
                <Paper rounded={ this.props.isLast ? true : false } zDepth={ this.expanded ? 2 : 1 } transitionEnabled={ false } style={ styles.self(this.props, this.expanded, this.hovered) }>
                    <div onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave } className="row">
                        <div onTouchTap={ (event) => this.handleAnnotateParagraph(stanza, event) } style={ styles.verseContent(this.props) } className="col-xs-11">
                            <p style={ styles.verse(this.expanded) }>
                                { stanza.lines.map((line, lineIndex) => this.renderPara(line, lineIndex, stanza.runningId, stanza.lines.length)) }
                            </p>
                            <div className="row" style={ { display: this.expanded ? "block" : "none" } }>
                                {
                                    stanza.analysis && Object.keys(stanza.analysis).length ? <div style={ { paddingBottom: 10 } }className="col-xs-12">{ translit(stanza.analysis.map((a) => a.token).join(" ")) }</div> : null
                                }
                            </div>
                        </div>
                        <div className="col-xs-1" style={ styles.verseHandleContainer } onClick={ (event: React.MouseEvent) => this.handleVerseClick(event, stanza.runningId) }>
                            {
                                this.expanded ?
                                    <div style={ styles.verseHandle }><HardwareKeyboardArrowUp /></div>
                                    : (
                                        this.hovered ?
                                            <div style={ styles.verseHandle }><HardwareKeyboardArrowDown /></div>
                                            : null
                                    )
                            }
                        </div>
                    </div>
                    { this.expanded ? getStanza(documentStore.shownDocument.url, stanza.runningId) : null }
                </Paper>
            </div>
        );
    }
}

const styles = {
    self: (props, expanded, hovered) => {

        let style: any = {
            padding: "0 20px",
            borderTopRightRadius: props.isLast ? 0 : "inherit",
            borderTopLeftRadius: props.isLast ? 0 : "inherit"
        };

        if (!expanded) {
            // style = { ...style, padding: props.verse.analysis && props.annotateMode ? '0 20px 0 18px' : '0 20px' };
            if (!props.annotateMode) {
                // style = { ...style, boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 6px 6px, rgba(0, 0, 0, 0.117647) 0px 6px 6px' };
                style = Object.assign(style, { boxShadow: "rgba(0, 0, 0, 0.117647) 0px 6px 6px, rgba(0, 0, 0, 0.117647) 0px 6px 6px" });
            }
            else {
                if (hovered) {
                    style = Object.assign(style, { backgroundColor: orange100 });
                }
            }

            if (props.isLast) {
                style = Object.assign(style, { padding: "0 20px 20px 20px" });
            }
            // else if (props.isFirst) {
            //     style = { ...style, padding: '20px 20px 0px 20px' }
            // }
        }
        else if (expanded) {
            style = Object.assign(style, { margin: "20px -30px 20px -30px" });
        }

        return style;
    },
    verseHandleContainer: {
        display: "flex",
        justifyContent: "center",
        cursor: "pointer"
    },
    verseHandle: {
        alignSelf: "center"
    },
    verse: (expanded) => {

        return {
            fontFamily: "Monotype Sabon, Auromere, serif, Siddhanta",
            margin: "8px 0",
            fontSize: expanded ? "1.5em" : "1em"
        };
    },
    verseContent: (props) => {

        if (props.annotateMode) {
            return {
                cursor: "context-menu"
            };
        }
    },
    loadProgress: {
        marginRight: -20,
        marginLeft: -20,
        width: "auto"
    }
};
