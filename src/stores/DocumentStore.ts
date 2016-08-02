import { observable, ObservableMap, map, asMap, action, computed } from "mobx";
import { Models } from "vml-common";

import { fetchData } from "../shared/utils";
import { FetchLevel } from "../shared/interfaces";

export class DocumentStore {
    @observable private shownDocumentURL: string;
    private documents: ObservableMap<Models.Document>;
    private loadingDocs: Set<string>;

    constructor(initialState?: any) {

        this.documents = initialState ? asMap(initialState.documents) : map({});
        this.loadingDocs = new Set("");
        this.shownDocumentURL = initialState ? initialState.shownDocumentURL : null;
    }

    @action
    private addDocumentToStore = (docURL: string, document: Models.Document) => {

        this.documents.set(docURL, document);
    }

    @action
    private setShownDocumentURL = (url: string) => {

        this.shownDocumentURL = url;
    }

    getDocument = (slug: string, subdocId?: string, recordId?: string) => {

        const docUrl = Models.Document.URL(slug, subdocId, recordId);

        if (docUrl === this.shownDocumentURL) {
            return;
        }

        if (this.documents.has(docUrl)) {
            this.setShownDocumentURL(docUrl);
        }
        else if (!this.loadingDocs.has(docUrl)) {
            return this.fetchDocument(docUrl);
        }
    }

    @computed get shownDocument() {

        if (this.shownDocumentURL) {
            return this.documents.get(this.shownDocumentURL);
        }
    }

    private fetchDocument = (docURL: string) => {

        this.loadingDocs.add(docURL);

        return fetchData(docURL, FetchLevel.App)
            .then(document => this.addDocumentToStore(docURL, document))
            .then(() => {

                this.setShownDocumentURL(docURL);
                this.loadingDocs.delete(docURL);
            });
    }
}
