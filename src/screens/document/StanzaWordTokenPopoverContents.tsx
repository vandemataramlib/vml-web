import * as React from "react";
import { Table, TableHeader, TableBody, TableHeaderColumn, TableRow, TableRowColumn } from "material-ui";
import { observer, inject } from "mobx-react";

import { Models } from "vml-common";

import { AppState } from "../../stores";
import { translit } from "../../shared/utils";
import { Encoding } from "../../shared/interfaces";
import { defaultEncoding } from "../../shared/constants";

interface StanzaWordTokenPopoverContentsProps {
    token: Models.Token;
    appState?: AppState;
}

@inject("appState")
@observer
export class StanzaWordTokenPopoverContents extends React.Component<StanzaWordTokenPopoverContentsProps, {}> {
    render() {

        const { token, appState } = this.props;

        if (!token || !token.ety) {
            return null;
        }

        return (
            <Table
                wrapperStyle={ styles.self }
                selectable={ false }
                >
                <TableHeader
                    displaySelectAll={ false }
                    adjustForCheckbox={ false }
                    >
                    <TableRow>
                        <TableHeaderColumn
                            children="Morpheme"
                            style={ Object.assign(styles.columnWidth(Width.Narrow), styles.font(true)) }
                            />
                        <TableHeaderColumn
                            children="Type"
                            style={ Object.assign(styles.columnWidth(Width.Medium), styles.font(true)) }
                            />
                        <TableHeaderColumn
                            children="Sense(s)"
                            style={ Object.assign(styles.columnWidth(Width.Spread), styles.font(true)) }
                            />
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={ false }
                    style={ styles.tableBody }
                    >
                    {
                        token.ety.map(etymology => {

                            return (
                                <TableRow key={ etymology.id }>
                                    <TableRowColumn
                                        children={
                                            translit(etymology.value, Encoding[defaultEncoding], Encoding[appState.encodingScheme.value])
                                        }
                                        style={ Object.assign(styles.columnWidth(Width.Narrow), styles.font(false, true)) }
                                        />
                                    <TableRowColumn
                                        children={
                                            Models.EtymologyType[etymology.type]
                                        }
                                        style={ Object.assign(styles.columnWidth(Width.Medium), styles.font(false)) }
                                        />
                                    <TableRowColumn
                                        children={ etymology.senses.join(", ") }
                                        style={ Object.assign(styles.columnWidth(Width.Spread), styles.font(false)) }
                                        />
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        );
    }
}

enum Width {
    Narrow,
    Medium,
    Spread
}

const styles = {
    self: {
        maxWidth: 550,
    },
    columnWidth: (width: Width) => {

        let style = {};

        if (width === Width.Narrow) {
            style = Object.assign(style, { width: "15%" });
        }
        else if (width === Width.Medium) {
            style = Object.assign(style, { width: "16%" });
        }

        return style;
    },
    font: (header: boolean, bold?: boolean) => {

        let style = {};

        if (header) {
            style = Object.assign(style, { fontSize: "0.85em" });
        } else {
            style = Object.assign(style, { fontSize: "1em" });
        }

        if (bold) {
            style = Object.assign(style, { fontWeight: "bold" });
        }

        return style;
    },
    tableBody: {
        fontFamily: "Monotype Sabon, serif, Siddhanta"
    }
};
