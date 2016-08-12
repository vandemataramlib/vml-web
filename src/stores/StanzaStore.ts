import { ObservableMap, observable, action, map, asMap, toJSON, toJS } from "mobx";
import { Models, Serializers } from "vml-common";
import { isEqual } from "lodash";

import { fetchData, patchData } from "../shared/utils";
import { AppState } from "./AppState";

const appState = new AppState();

export class StanzaStore {
    @observable stanzas: ObservableMap<Models.Stanza>;
    private loadingStanzas: Set<string>;

    constructor(initialState?: any) {

        this.stanzas = initialState ? asMap(initialState.stanzas) : map({});
        this.loadingStanzas = new Set([]);
    }

    @action
    private addStanzaToStore = (stanzaUrl: string, stanza: Models.Stanza) => {

        this.stanzas.set(stanzaUrl, new Models.Stanza(stanza));
    }

    getStanza = (documentURL: string, runningStanzaId: string) => {

        const stanzaURL = Models.Stanza.URLFromDocURL(documentURL, runningStanzaId);

        return this.getStanzaFromURL(stanzaURL);
    }

    tryUpdatingStanza = (documentURL: string, runningStanzaId: string, updatedStanza: Models.Stanza) => {

        const stanzaURL = Models.Stanza.URLFromDocURL(documentURL, runningStanzaId);
        const updatedObject = toJS(updatedStanza);
        const originalObject = toJS(this.stanzas.get(stanzaURL));

        if (!isEqual(updatedObject, originalObject)) {
            this.patchStanza(stanzaURL, updatedStanza);
        }
    }

    @action
    updateStanza = (stanzaURL: string, updatedStanza: Models.Stanza) => {

        this.stanzas.set(stanzaURL, updatedStanza);
    }

    getStanzaFromURL = (stanzaURL: string) => {

        if (this.stanzas.has(stanzaURL)) {
            return this.stanzas.get(stanzaURL);
        } else if (!this.loadingStanzas.has(stanzaURL)) {
            this.fetchStanza(stanzaURL);
            return null;
        }
    }

    private fetchStanza = (stanzaURL: string) => {

        this.loadingStanzas.add(stanzaURL);

        fetchData<Models.Stanza>(stanzaURL)
            .then(stanza => this.addStanzaToStore(stanzaURL, stanza))
            .then(() => { this.loadingStanzas.delete(stanzaURL); });
    }

    private patchStanza = (stanzaURL: string, updatedStanza: Models.Stanza) => {

        const topLevelLinks = {
            self: stanzaURL
        };

        const stanzaSerializer = Serializers.getStanzaSerializer("stanzas", topLevelLinks);

        const patchedStanza = JSON.stringify((stanzaSerializer.serialize(toJS(updatedStanza))));

        patchData<Models.Stanza>(stanzaURL, patchedStanza)
            .then(updatedDBStanza => {

                this.updateStanza(stanzaURL, updatedDBStanza);
                appState.showSnackbar({
                    message: `Stanza ${updatedDBStanza.runningId} updated`
                });
            })
            .catch((err: Error) => {

                appState.showSnackbar({
                    message: `Error updating stanza ${updatedStanza.runningId}`,
                    action: "OK",
                    autoHideDuration: 0
                });
            });
    }
}
