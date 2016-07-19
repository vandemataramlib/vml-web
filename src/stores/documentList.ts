import { observable, computed, action } from "mobx";

import { Store } from "../interfaces/store";
import { API_SERVER_BASE_URL } from "../config/api";
import { fetchData } from "../utils";

export interface IDocumentListGroup {
    id: string;
    title: string;
    subtitle?: string;
    desc?: string;
    items: DocumentListItem[];
}

export class DocumentListGroup implements IDocumentListGroup {
    static baseURL = API_SERVER_BASE_URL + "/docList";
    static URL = (id: string) => API_SERVER_BASE_URL + "/docList/" + id;
    id: string;
    title: string;
    items: DocumentListItem[];
}

interface DocumentListItem {
    title: string;
    url: string;
}

export class DocumentListStore implements Store {
    @observable isLoading = false;
    @observable documentListGroups: DocumentListGroup[];

    constructor(initialState?: DocumentListStore) {
        this.documentListGroups = initialState ? initialState.documentListGroups : [];
    }

    @action
    private setDocumentList = (documentListGroups: DocumentListGroup[]) => {

        this.documentListGroups = documentListGroups;
    }

    getDocumentList = () => {

        return fetchData(DocumentListGroup.baseURL)
            .then(this.setDocumentList);
    }
}
