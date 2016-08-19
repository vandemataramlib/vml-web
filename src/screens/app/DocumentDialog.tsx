import * as React from "react";
import { Dialog, FlatButton, SelectField, MenuItem, Divider, TextField, AutoComplete } from "material-ui";
import { observable, action, computed } from "mobx";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import * as ReactRouter from "react-router";
import { Models } from "vml-common";

import { DocumentStore } from "../../stores";
import { translit, normalizeRoman } from "../../shared/utils";

interface DocumentDialogProps {
    open: boolean;
    onRequestClose: (clicked: boolean) => void;
    documentStore?: DocumentStore;
    router?: ReactRouter.IRouter;
}

interface DocumentDialogRefs {
    compilationName?: TextField;
    volumeName?: TextField;
}

@inject("documentStore")
@withRouter
@observer
export class DocumentDialog extends React.Component<DocumentDialogProps, {}> {
    @observable docType: Models.DocType = null;
    @observable compilationName: string = "";
    @observable volumeName: string = "";
    componentRefs: DocumentDialogRefs = {};

    @action
    handleDocTypeChanged = (event, index: number, value: string) => {

        this.setCompilationName("");
        this.setVolumeName("");
        this.docType = index;
    }

    @action
    setCompilationName = (compName: string) => {

        this.compilationName = compName;
    }

    @action
    setVolumeName = (volName: string) => {

        this.volumeName = volName;
    }

    @action
    setDocType = (docType: Models.DocType) => {

        this.docType = docType;
    }

    @computed
    get newDocumentWebUrl() {

        let slug;
        let subdocId;
        let recordId;

        if (this.docType === Models.DocType.Compilation && this.compilationName) {
            slug = normalizeRoman(this.compilationName).split(" ").join("-");
        }
        else if (this.docType === Models.DocType.Volume && this.volumeName !== "") {
            slug = normalizeRoman(this.compilationName).split(" ").join("-");
            subdocId = normalizeRoman(this.volumeName).split(" ").join("-");
        }

        if (!slug) {
            return "";
        }

        const urlToParams = Models.Document.URL(slug, subdocId, recordId);

        return Models.Document.URLToWebURL(urlToParams);
    }

    componentWillReceiveProps() {

        this.setCompilationName("");
        this.setVolumeName("");
        this.setDocType(null);
    }

    handleCompilationNameChange = (event) => {

        this.setCompilationName(event.target.value);
    }

    handleVolumeNameChange = (event) => {

        this.setVolumeName(event.target.value);
    }

    handleCreateDocument = () => {

        if (this.docType === Models.DocType.Compilation) {
            const slug = normalizeRoman(this.compilationName).split(" ").join("-");
            const newCompilation = new Models.Document({
                _id: null,
                url: Models.Document.URL(slug),
                docType: Models.DocType.Compilation,
                contents: {},
                title: this.compilationName
            });
            this.props.documentStore.addDocumentToStore(newCompilation);
        }
        else if (this.docType === Models.DocType.Volume) {
            const slug = normalizeRoman(this.compilationName).split(" ").join("-");
            const subdocId = normalizeRoman(this.volumeName).split(" ").join("-");
            const newVolume = new Models.Document({
                _id: null,
                url: Models.Document.URL(slug, subdocId),
                docType: Models.DocType.Volume,
                contents: {},
                title: this.volumeName
            });
            this.props.documentStore.addDocumentToStore(newVolume);
        }
        else {
            this.props.router.push("/new");
        }

        this.props.onRequestClose(false);
    }

    getDialogChildren(): JSX.Element {

        const styles = getStyles();

        const docTypes = [
            Models.DocType[Models.DocType.Compilation],
            Models.DocType[Models.DocType.Volume],
            Models.DocType[Models.DocType.Chapter],
        ];

        return (
            <div>
                <SelectField
                    floatingLabelText="Document type"
                    fullWidth
                    value={ this.docType }
                    onChange={ this.handleDocTypeChanged }
                    >
                    {
                        docTypes.map((docType, index) =>

                            <MenuItem
                                value={ index }
                                primaryText={ docType }
                                key={ docType }
                                />
                        )
                    }
                </SelectField>
                {
                    this.docType !== null && this.docType === Models.DocType.Compilation &&
                    <div>
                        <TextField
                            floatingLabelText="Compilation name (ITRANS)"
                            fullWidth
                            errorText="Required"
                            inputStyle={ styles.itransText }
                            ref={ (compName) => this.componentRefs.compilationName = compName }
                            onChange={ this.handleCompilationNameChange }
                            />
                        <div style={ styles.urlContainer }>
                            <TextField
                                floatingLabelText="Compilation name (Devanagari)"
                                value={ translit(this.compilationName) }
                                />
                            <TextField
                                floatingLabelText="Compilation URL"
                                value={ this.newDocumentWebUrl }
                                />
                        </div>
                    </div>
                }
                {
                    this.docType !== null && this.docType === Models.DocType.Volume &&
                    <div>
                        <div className="etymology-list">
                            <AutoComplete
                                floatingLabelText="Compilation name"
                                hintText="Select if this volume belongs to a compilation"
                                dataSource={
                                    this.props.documentStore.compilations
                                }
                                onNewRequest={ (request, index) => this.setCompilationName((request as any).text) }
                                fullWidth
                                />
                        </div>
                        <TextField
                            floatingLabelText="Volume name (ITRANS)"
                            fullWidth
                            errorText="Required"
                            inputStyle={ styles.itransText }
                            ref={ (volName) => this.componentRefs.volumeName = volName }
                            onChange={ this.handleVolumeNameChange }
                            id="volume-name"
                            />
                        <div style={ styles.urlContainer }>
                            <TextField
                                floatingLabelText="Volume name (Devanagari)"
                                value={ translit(this.volumeName) }
                                />
                            <TextField
                                floatingLabelText="Volume URL"
                                value={ this.newDocumentWebUrl }
                                />
                        </div>
                    </div>
                }
            </div>
        );
    }

    getDialogActions(): JSX.Element[] {

        return [
            <FlatButton
                label="Cancel"
                secondary
                onTouchTap={ (event) => this.props.onRequestClose(false) }
                />,
            <FlatButton
                label="Create"
                primary
                onTouchTap={ this.handleCreateDocument }
                />
        ];
    }

    render() {

        const { open, onRequestClose } = this.props;

        const styles = getStyles();

        return (
            <Dialog
                title="Create a new document"
                open={ open }
                onRequestClose={ onRequestClose }
                children={ this.getDialogChildren() }
                actions={ this.getDialogActions() }
                contentStyle={ styles.contentStyle }
                autoScrollBodyContent
                />
        );
    }
}

function getStyles() {

    const styles = {
        contentStyle: {
            width: "40%"
        },
        itransText: {
            fontFamily: "monospace"
        },
        urlContainer: {
            display: "flex"
        }
    };

    return styles;
}
