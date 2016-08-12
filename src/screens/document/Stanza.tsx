import * as React from "react";
import { Paper, LinearProgress, Checkbox } from "material-ui";
import { HardwareKeyboardArrowDown, HardwareKeyboardArrowUp } from "material-ui/svg-icons";
import { orange100, orange500 } from "material-ui/styles/colors";
import { observer, inject } from "mobx-react";
import { observable, action } from "mobx";
import { Models } from "vml-common";

import { translit } from "../../shared/utils";
import { AppState, DocumentStore, StanzaStore } from "../../stores";
import { Encoding } from "../../shared/interfaces";
import { defaultEncoding } from "../../shared/constants";
import { StanzaBody } from "./StanzaBody";

interface StanzaProps {
    stanza: Models.Stanza;
    isLast: boolean;
    appState?: AppState;
    documentStore?: DocumentStore;
    stanzaStore?: StanzaStore;
};

@inject("appState", "documentStore", "stanzaStore")
@observer
export class Stanza extends React.Component<StanzaProps, {}> {
    @observable hovered: boolean;
    @observable expanded: boolean;

    componentWillReceiveProps() {

        this.setExpanded(false);
    }

    @action
    setHovered = (hovered: boolean) => {

        this.hovered = hovered;
    }

    @action
    setExpanded = (expanded: boolean) => {

        this.expanded = expanded;
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

        const { appState, documentStore, stanzaStore } = this.props;

        if (!appState.annotateMode) {
            return;
        }

        event.preventDefault();

        stanzaStore.getStanza(documentStore.shownDocument.url, stanza.runningId);

        appState.openStanzaDialog(documentStore.shownDocument.url, stanza.runningId);
    }

    handleCheckboxClicked = (event: React.MouseEvent, runningId: string) => {

        event.stopPropagation();

        const { appState } = this.props;

        if (!appState.selectedStanzas.find(id => id === runningId)) {
            appState.selectStanza(runningId);
        }
        else {
            appState.deselectStanza(runningId);
        }
    }

    renderPara = (line: Models.Line, lineIndex, stanzaRunningId: string, stanzaLength: number): string | (React.ReactElement<any> | string | number)[] => {

        const { appState } = this.props;

        let newLine = "";

        if (stanzaLength - 1 === lineIndex) {
            newLine += `${line.line} ||${stanzaRunningId}||`;
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

    render() {

        const { stanza, stanzaStore, documentStore, appState } = this.props;

        const showStanza = (url: string, runningStanzaId: string) => {

            const stanzaURL = Models.Stanza.URLFromDocURL(documentStore.shownDocument.url, runningStanzaId);

            if (!this.expanded || !stanzaStore.stanzas.has(stanzaURL)) {
                return (
                    <p style={ styles.stanza(this.expanded) }>
                        { stanza.lines.map((line, lineIndex) => this.renderPara(line, lineIndex, stanza.runningId, stanza.lines.length)) }
                    </p>
                );
            }

            const stanzaFromStore = stanzaStore.getStanzaFromURL(stanzaURL);

            return <StanzaBody stanza={ stanzaFromStore } />;
        };

        const showProgress = (url: string, runningStanzaId: string) => {

            const stanza = stanzaStore.getStanza(url, runningStanzaId);

            if (!stanza) {
                return <LinearProgress mode="indeterminate" style={ styles.loadProgress } />;
            }
        };

        return (
            <div id={ "p" + stanza.runningId } style={ stanza.analysis && !this.expanded && appState.annotateMode ? { borderRight: `2px solid ${orange500}` } : null }>
                <Paper rounded={ this.props.isLast ? true : false } zDepth={ this.expanded ? 2 : 1 } transitionEnabled={ false } style={ styles.self(this.props, this.expanded, this.hovered) }>
                    <div onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave } className="row">
                        <div onTouchTap={ (event) => this.handleAnnotateParagraph(stanza, event) } style={ styles.verseContent(this.props) } className="col-xs-11">
                            {
                                showStanza(documentStore.shownDocument.url, stanza.runningId)
                            }
                        </div>
                        <div className="col-xs-1" style={ styles.stanzaHandleContainer }  onClick={ () => this.setExpanded(!this.expanded) }>
                            <div style={ styles.stanzaHandle }>
                                { this.expanded ?
                                    <HardwareKeyboardArrowUp />
                                    : <HardwareKeyboardArrowDown
                                        style={ styles.stanzaHandleIcon(this.hovered) }
                                        />
                                }
                            </div>
                            <Checkbox
                                onClick={ (event) => this.handleCheckboxClicked(event, stanza.runningId) }
                                style={ styles.stanzaSelector(this.hovered || this.expanded || appState.stanzaSelectMode) }
                                />
                        </div>
                    </div>
                    { this.expanded && showProgress(documentStore.shownDocument.url, stanza.runningId) }
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
            borderTopLeftRadius: props.isLast ? 0 : "inherit",
            fontFamily: "Monotype Sabon, Auromere, serif, Siddhanta"
        };

        if (!expanded) {
            // style = { ...style, padding: props.verse.analysis && props.annotateMode ? '0 20px 0 18px' : '0 20px' };
            if (!props.appState.annotateMode) {
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
            style = Object.assign(style, { margin: "20px -30px 20px -30px", padding: "20px" });
        }

        return style;
    },
    stanzaHandleContainer: {
        display: "flex",
        cursor: "pointer",
        alignItems: "center"
    },
    stanzaHandle: {
        display: "flex"
    },
    stanzaHandleIcon: (shown: boolean) => {

        if (shown) {
            return {
                transition: "none",
                opacity: 1
            };
        };

        return {
            transition: "none",
            opacity: 0
        };
    },
    stanza: (expanded) => {

        return {
            margin: "8px 0",
            fontSize: expanded ? "1.5em" : "1em"
        };
    },
    verseContent: (props) => {

        if (props.appState.annotateMode) {
            return {
                cursor: "context-menu"
            };
        }
    },
    loadProgress: {
        marginRight: -20,
        marginLeft: -20,
        width: "auto"
    },
    stanzaSelector: (shown: boolean) => {

        return shown ? { opacity: 1 } : { opacity: 0 };
    }
};
