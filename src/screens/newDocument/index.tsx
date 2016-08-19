import * as React from "react";
import { withRouter } from "react-router";
import { MenuItem, SelectField, TextField, FlatButton } from "material-ui";

import { PaperCustom } from "../shared/PaperCustom";

const categories = [
    {
        c: "Shruti",
        id: 1,
        sub: [
            {
                c: "Veda",
                id: 11
            },
            {
                c: "Upanishad",
                id: 12
            },
            {
                c: "Gita",
                id: 11
            }
        ]
    },
    {
        c: "Smriti",
        id: 2,
        sub: [
            {
                c: "Purana",
                id: 21
            }
        ]
    },
    {
        c: "Itihasa",
        id: 3,
        sub: [
            {
                c: "Ramayana",
                id: 31
            },
            {
                c: "Mahabharata",
                id: 32
            }
        ]
    },
    {
        c: "Shastra",
        id: 4
    },
    {
        c: "Literature",
        id: 5
    },
    {
        c: "Tantra",
        id: 6
    },
    {
        c: "Vedanta",
        id: 7
    },
    {
        c: "Yoga",
        id: 8
    },
    {
        c: "Science and Technology",
        id: 9
    },
    {
        c: "Other",
        id: 10
    }
];

interface TextFormProps {
    router: Array<any>;
}

export class TextForm extends React.Component<TextFormProps, any> {
    componentRefs: {
        documentTitle?: TextField;
        documentCategory?: TextField;
        documentSubCategory?: TextField;
        documentTags?: TextField;
        documentText?: TextField;
    } = {};

    constructor(props) {

        super(props);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleCreateClicked = this.handleCreateClicked.bind(this);
        this.handleCancelClicked = this.handleCancelClicked.bind(this);
        this.state = {
            selectedCategory: ""
        };
    }

    handleCategoryChange(event, index, value) {

        this.setState({
            selectedCategory: value
        });
    }

    handleCreateClicked(event) {

        const documentTitle = this.componentRefs.documentTitle.getValue();
        const slug = documentTitle.split(" ").join("-");

        const documentTextRaw = this.componentRefs.documentTitle.getValue();

        const refPattern = /\|{1,2}[\d\s]*\|{0,2}/;
        const verses = documentTextRaw.split("\n\n").map((verse, verseIndex) => {

            const lines = verse.split("\n").map((line, lineIndex) => {

                line = line.replace(refPattern, "").trim();
                const words = line.split(" ").map((word, wordIndex) => {

                    const wordId = (verseIndex + 1) + "." + (lineIndex + 1) + "." + (wordIndex + 1);
                    return { id: wordId, word };
                });
                return { id: (verseIndex + 1) + "." + (lineIndex + 1), words, line };
            });
            return { id: verseIndex + 1, lines, verse };
        });

        const documentObject = {
            id: Date.now().toString(),
            title: documentTitle,
            slug,
            category: this.componentRefs.documentCategory.getValue(),
            subCategory: this.componentRefs.documentSubCategory.getValue(),
            tags: this.componentRefs.documentTags.getValue().split(",").map((tag) => tag.trim()),
            text: verses
        };

        const storedDocuments = localStorage.getItem("documents");

        let docObj;

        if (!storedDocuments) {
            docObj = [];
        }
        else {
            docObj = JSON.parse(storedDocuments);
        }

        docObj.push(documentObject);

        // localStorage.setItem(slug, JSON.stringify(documentObject));
        localStorage.setItem("documents", JSON.stringify(docObj));
        this.props.router.push(`/documents/${slug}`);
    }

    handleCancelClicked() {

        this.props.router.push("/");
    }

    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>New Chapter</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextField
                                    hintText="Document title in ITRANS"
                                    floatingLabelText="Title"
                                    fullWidth
                                    ref={ (documentTitle) => this.componentRefs.documentTitle = documentTitle }
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <SelectField
                                    floatingLabelText="Category"
                                    fullWidth
                                    onChange={ this.handleCategoryChange }
                                    value={ this.state.selectedCategory }
                                    ref={ (documentCategory) => this.componentRefs.documentCategory = documentCategory }
                                    >
                                    { categories.map((category) => <MenuItem value={ category.id } key={ category.id } primaryText={ category.c } />) }
                                </SelectField>
                            </div>
                            <div className="col-xs-6">
                                <TextField
                                    floatingLabelText="Sub-category"
                                    fullWidth
                                    ref={ (documentSubCategory) => this.componentRefs.documentSubCategory = documentSubCategory }
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextField
                                    hintText="Comma-separated"
                                    floatingLabelText="Tags"
                                    fullWidth
                                    ref={ (documentTags) => this.componentRefs.documentTags = documentTags }
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TextField
                                    hintText="Main document text in ITRANS"
                                    floatingLabelText="Text"
                                    multiLine
                                    rows={ 20 }
                                    fullWidth
                                    ref={ (documentText) => this.componentRefs.documentText = documentText }
                                    />
                            </div>
                        </div>
                        <div className="row" style={ styles.createButton }>
                            <div className="col-xs-12">
                                <FlatButton label="Cancel" secondary onClick={ this.handleCancelClicked } />
                                <FlatButton label="Create" primary onClick={ this.handleCreateClicked } />
                            </div>
                        </div>
                    </PaperCustom>
                </div>
            </div>
        );
    }
}

export default withRouter(TextForm);

const styles = {
    createButton: {
        marginTop: 30,
        textAlign: "right"
    }
};
