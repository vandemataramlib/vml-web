import * as React from "react";
import Paper from "material-ui/Paper";
import KeyboardArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import KeyboardArrowUp from "material-ui/svg-icons/hardware/keyboard-arrow-up";
import { orange100, orange500 } from "material-ui/styles/colors";
import { observer } from "mobx-react";
import { observable, transaction } from "mobx";

import { DEFAULT_TEXT_ENCODING } from "../shared/constants";
import { translit } from "../../utils";
import { AppState, Encoding } from "../../stores/appState";
import { DocumentStore, Text } from "../../stores/documents";

interface ParagraphProps {
    text: Text;
    annotateMode: boolean;
    isLast: boolean;
    appState?: AppState;
    onDialogOpen: React.EventHandler<any>;
};

@observer(["appState", "documentStore"])
export class Paragraph extends React.Component<ParagraphProps, {}> {
    @observable hovered: boolean = false;
    @observable expanded: boolean = false;
    @observable popoverOpen: boolean = false;
    @observable dialog: any;

    handleMouseEnter = (event) => {

        this.hovered = true;
    }

    handleMouseLeave = (event) => {

        this.hovered = false;
    }

    handleVerseClick = () => {

        this.expanded = !this.expanded;
    }

    handleAnnotateParagraph = (text, event) => {

        if (!this.props.annotateMode) {
            return;
        }

        event.preventDefault();

        this.props.onDialogOpen(text);
    }

    renderPara = (line, lineIndex): string | (React.ReactElement<any> | string | number)[] => {

        const lineEl = translit(line.trim(), DEFAULT_TEXT_ENCODING, Encoding[this.props.appState.encodingScheme.value]);

        if (lineIndex === 0) {
            return lineEl;
        }

        return React.Children.toArray([
            <br/>,
            lineEl
        ]);
    }

    render() {

        const { text } = this.props;
        return (
            <div id={ "p" + (text.id + 1) } style={ text.analysis && !this.expanded && this.props.annotateMode ? { borderRight: `2px solid ${orange500}` } : null }>
                <Paper rounded={ this.props.isLast ? true : false } zDepth={ this.expanded ? 2 : 1 } style={ styles.self(this.props, this.expanded, this.hovered) }>
                    <div onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave } className="row">
                        <div onTouchTap={ (event) => this.handleAnnotateParagraph(text, event) } style={ styles.verseContent(this.props) } className="col-xs-11">
                            <p style={ styles.verse(this.expanded) }>
                                { text.verse.split("\n").map(this.renderPara) }
                            </p>
                            <div className="row" style={ { display: this.expanded ? "block" : "none" } }>
                                {
                                    text.analysis ? <div style={ { paddingBottom: 10 } }className="col-xs-12">{ translit(text.analysis.map((a) => a.token).join(" ")) }</div> : null
                                }
                            </div>
                        </div>
                        <div className="col-xs-1" style={ styles.verseHandleContainer } onTouchTap={ this.handleVerseClick }>
                            {
                                this.expanded ?
                                    <div style={ styles.verseHandle }><KeyboardArrowUp /></div>
                                    : (
                                        this.hovered ?
                                            <div style={ styles.verseHandle }><KeyboardArrowDown /></div>
                                            : null
                                    )
                            }
                        </div>
                    </div>
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
            style = Object.assign(style, { margin: "20px -20px 20px -20px" });
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
    }
};
