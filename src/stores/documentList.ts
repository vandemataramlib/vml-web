import { observable, computed, action } from "mobx";
import { Constants, Models } from "vml-common";

import { Store } from "../interfaces/store";
import { fetchData } from "../utils";

// export interface IDocumentListGroup {
//     id: string;
//     title: string;
//     subtitle?: string;
//     desc?: string;
//     items: DocumentListItem[];
// }

// export class DocumentListGroup implements IDocumentListGroup {
//     static baseURL = Constants.API_SERVER_BASE_URL + "/docList";
//     static URL = (id: string) => Constants.API_SERVER_BASE_URL + "/docList/" + id;
//     id: string;
//     title: string;
//     items: DocumentListItem[];
// }

// interface DocumentListItem {
//     title: string;
//     url: string;
// }

export class DocumentListStore implements Store {
    @observable isLoading = false;
    @observable documentListGroups: Models.DocumentListGroup[];

    constructor(initialState?: DocumentListStore) {
        this.documentListGroups = initialState ? initialState.documentListGroups : [];
    }

    @action
    private setDocumentList = (documentListGroups: Models.DocumentListGroup[]) => {

        this.documentListGroups = documentListGroups;
    }

    getDocumentList = () => {

        return fetchData(Models.DocumentListGroup.URL())
            .then(this.setDocumentList);
    }
}
