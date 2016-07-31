import { observable, computed, action, toJS } from "mobx";
import { Models, Constants } from "vml-common";

import { Store } from "../interfaces/store";
import { translit, fetchData } from "../utils";


type DocumentsCollection = {
    [slug: string]: Models.Document;
}

export class DocumentStore implements Store {
    @observable documentsCollection: DocumentsCollection;
    // @observable documents: Array<Document>;
    @observable shownDocument: Models.Document;
    @observable isLoading;

    // @computed get documentsTOC() {
    //     return this.documents.map(document => {
    //         return {
    //             u: `${Document.getSingleDocumentURL(document.slug)}`,
    //             t: translit(document.title)
    //         };
    //     });
    // }

    constructor(initialState?: DocumentStore) {
        this.documentsCollection = initialState ? initialState.documentsCollection : {};
        // this.documents = initialState ? initialState.documents : [];
        this.shownDocument = initialState ? initialState.shownDocument : null;
    }

    @action
    addDocumentToStore = (document: Models.Document) => {
        console.log(document);
        this.documentsCollection[document.url] = document;
        return document;
    }

    // @action
    // addDocumentsToStore = (documents) => {
    //     this.documents = documents;
    // }

    @action
    showDocument(slug: string, subdocId?: string, recordId?: string): Promise<any> {

        const docUrl = `/docs/${slug}` + (subdocId ? `/subdocId/${subdocId}` : "") + (recordId ? `/recordId/${recordId}` : "");

        if (this.documentsCollection[docUrl]) {
            this.shownDocument = this.documentsCollection[docUrl];
            return;
        } else {
            return fetchData(Models.Document.URL(slug, subdocId, recordId))
                .then(this.addDocumentToStore)
                .then((document) => { this.shownDocument = this.documentsCollection[docUrl]; });
        }
    }


    getDocumentByURL = (url: string): Models.Document => {

        return this.documentsCollection[url];
    }

    // @action
    // getDocuments() {
    //     return fetchData(Document.getAllDocumentsAPIURL())
    //         .then(this.addDocumentsToStore);
    // }

    @action
    updateDocumentText(url: string, updatedText: Models.Stanza) {
        // const text = this.documentsCollection[slug].text;
        // for (let i = 0; i < text.length; i++) {
        //     if (text[i].id === updatedText.id) {
        //         text[i] = updatedText;
        //         break;
        //     } else {
        //         continue;
        //     }
        // }
        const document = this.documentsCollection[url];
        const chapter = <Models.Chapter>document.contents;
        const stanzaPath = `segments.${updatedText.segmentId}.stanzas.${updatedText.id}`;

        // chapter.stanzas = chapter.stanzas.map(paragraph => {

        //     if (paragraph.id === updatedText.id) {
        //         paragraph = updatedText;
        //     }

        //     return paragraph;
        // });
    }

    @action
    updateStanza = (url: string, stanzaId: string, updatedStanza: Models.Stanza) => {


        // const document = this.getDocumentByURL(url);
        // const chapter = <Models.Chapter>document.contents;
        // chapter.stanzas = chapter.stanzas.map(stanza => {

        //     if (stanza.id === stanzaId) {
        //         stanza = updatedStanza;
        //     }

        //     return stanza;
        // });

        // console.log(toJS(chapter.stanzas));
    }

    @action
    getStanza(url: string, stanzaId: string) {

        // const stanza = (<Models.Chapter>this.getDocumentByURL(url).contents).stanzas.find(stanza => stanza.id === stanzaId);
        // if (stanza.lines[0].words) {
        //     return;
        // }
        // else {
        //     fetchData(Models.Stanza.URLFromView(url, stanzaId))
        //         .then((stanza) => this.updateStanza(url, stanzaId, stanza));
        // }
    }
}
