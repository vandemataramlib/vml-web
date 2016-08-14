import { observable, action, ObservableMap, map, asMap, computed, toJS } from "mobx";
import { Models, Serializers } from "vml-common";
import { Deserializer } from "jsonapi-serializer";

import { SelectedCollection, CollectionDialogRefs } from "../shared/interfaces";
import { AppState, DocumentStore } from "./";
import { fetchData, postData, patchData } from "../shared/utils";

const appState = new AppState();

export class CollectionStore {
    @observable collections: ObservableMap<Models.Collection>;
    private loadingCollections: Set<string>;
    private loadingAllCollections: boolean;

    constructor(initialState?: any) {

        this.collections = initialState ? initialState.collections : map({});
        if (appState.isClientEnv) {
            this.loadingCollections = new Set([]);
        }
    }

    getCollection(id: string) {

        if (this.collections.has(id)) {
            return Promise.resolve(this.collections.get(id));
        }
        else if (!this.loadingCollections.has(id)) {
            return this.fetchCollection(id);
        }
    }

    @action
    setCollections = (collections: Models.Collection[]) => {

        collections.forEach(collection => {

            this.collections.set(collection._id, collection);
        });
        return this.collections;
    }

    @action
    setCollection = (collection: Models.Collection) => {

        this.collections.set(collection._id, collection);
        return collection;
    }

    tryCreatingCollection = (documentStore: DocumentStore, formValues: CollectionDialogRefs) => {

        const collectionStanzas = appState.selectedStanzas.map((runningId, index) => {

            const stanza = <Models.CollectionStanza>documentStore.getStanzaFromShownChapter(runningId);
            stanza.id = index;
            stanza.originalURL = Models.Stanza.URLFromDocURL(documentStore.shownDocument.url, stanza.runningId);
            stanza.referenceTitle = documentStore.shownDocument.title;
            stanza.runningId = (index + 1).toString();
            return new Models.CollectionStanza(stanza);
        });

        const collectionSegment = new Models.CollectionSegment({ stanzas: collectionStanzas, id: 0 });

        const collectionDesc = formValues.collectionDesc.getValue().trim();

        const collection = new Models.Collection({
            title: formValues.collectionName.getValue().trim(),
            description: collectionDesc.length > 0 ? collectionDesc : null,
            segments: [collectionSegment],
        });

        this.postCollection(collection);
    }

    tryUpdatingCollection = (documentStore: DocumentStore, collectionId: string) => {

        const currentStanzas = this.collections.get(collectionId).segments[0].stanzas;
        const lastRunningId = parseInt(currentStanzas[currentStanzas.length - 1].runningId);

        const collectionStanzas = appState.selectedStanzas.map((runningId, index) => {

            const stanza = <Models.CollectionStanza>documentStore.getStanzaFromShownChapter(runningId);
            stanza.id = index;
            stanza.originalURL = Models.Stanza.URLFromDocURL(documentStore.shownDocument.url, stanza.runningId);
            stanza.referenceTitle = documentStore.shownDocument.title;
            stanza.runningId = (lastRunningId + index + 1).toString();
            stanza.segmentId = 0;
            return new Models.CollectionStanza(stanza);
        });

        this.patchCollection(collectionId, collectionStanzas);
    }

    @computed
    get collectionList(): SelectedCollection[] {

        if (this.collections.size === 0) {
            this.fetchCollections();
            return [];
        }

        const list: SelectedCollection[] = [];

        for (let [collectionId, collection] of this.collections.entries()) {

            list.push({
                id: collectionId,
                title: collection.title
            });
        }

        return list;
    }

    private fetchCollections() {

        return fetchData<Models.Collection[]>(Models.Collection.URL())
            .then(collections => {

                const mapped = collections.map(collection => {

                    collection._id = (<any>collection).id;
                    delete (<any>collection).id;
                    return collection;
                });
                this.loadingAllCollections = false;
                return this.setCollections(mapped);
            });
    }

    private fetchCollection(id: string) {

        this.loadingCollections.add(id);

        return fetchData<Models.Collection>(Models.Collection.URL(id))
            .then(collection => {

                collection._id = (<any>collection).id;
                delete (<any>collection).id;

                this.loadingCollections.delete(id);
                return this.setCollection(collection);
            });
    }

    private postCollection(collection: Models.Collection) {

        const payload = JSON.stringify(Serializers.getCollectionSerializer("collections").serialize(collection));

        return postData<Models.Collection>(Models.Collection.URL(), payload)
            .then(dbCollection => {

                dbCollection._id = (<any>dbCollection).id;
                delete (<any>dbCollection).id;
                this.setCollection(dbCollection);
                appState.showSnackbar({
                    message: `Collection ${dbCollection.title} created`,
                    action: "View",
                    autoHideDuration: 5000
                });
            })
            .catch((err: Error) => {

                appState.showSnackbar({
                    message: `Error creating collection`,
                    action: "OK",
                    autoHideDuration: 0
                });
            });
    }

    private patchCollection(id: string, stanzas: Models.CollectionStanza[]) {

        const collectionStanzasSerializer = Serializers.getCollectionStanzaSerializer("collectionStanzas");
        const patchedCollectionStanza = JSON.stringify(collectionStanzasSerializer.serialize(stanzas));

        return patchData<Models.Collection>(Models.Collection.URL(id), patchedCollectionStanza)
            .then(dbCollection => {

                dbCollection._id = (<any>dbCollection).id;
                delete (<any>dbCollection).id;

                this.setCollection(dbCollection);
                appState.showSnackbar({
                    message: `Collection ${dbCollection.title} updated`
                });
            })
            .catch((err: Error) => {

                appState.showSnackbar({
                    message: `Error updating collection`,
                    action: "OK",
                    autoHideDuration: 0
                });
            });
    }
}
