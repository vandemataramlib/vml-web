import { observable, computed, action } from "mobx";
import { Constants, Models } from "vml-common";

import { fetchData } from "../shared/utils";
import { FetchLevel } from "../stores";

export class DocumentListStore {
    @observable documentListGroups: Models.DocumentListGroup[];

    constructor(initialState?: DocumentListStore) {

        this.documentListGroups = initialState ? initialState.documentListGroups : [];
    }

    @action
    private setDocumentList = (documentListGroups: Models.DocumentListGroup[]) => {

        this.documentListGroups = documentListGroups;
    }

    getDocumentList = () => {

        if (!this.documentListGroups.length) {
            return fetchData(Models.DocumentListGroup.URL(), FetchLevel.Local)
                .then(this.setDocumentList);
        }
    }
}
