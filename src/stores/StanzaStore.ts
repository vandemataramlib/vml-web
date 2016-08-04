import { ObservableMap, observable, action, map, asMap, toJSON, toJS } from "mobx";
import { Models, Serializers } from "vml-common";

import { fetchData, patchData } from "../shared/utils";

export class StanzaStore {
    @observable private stanzas: ObservableMap<Models.Stanza>;
    private loadingStanzas: Set<string>;

    constructor(initialState?: any) {

        this.stanzas = initialState ? asMap(initialState.stanzas) : map({});
        this.loadingStanzas = new Set("");
    }

    @action
    private addStanzaToStore = (stanzaUrl: string, stanza: Models.Stanza) => {

        this.stanzas.set(stanzaUrl, stanza);
    }

    getStanza = (documentURL: string, runningStanzaId: string) => {

        const stanzaURL = Models.Stanza.URLFromDocURL(documentURL, runningStanzaId);

        return this.getStanzaFromURL(stanzaURL);
    }

    @action
    updateStanza = (documentURL: string, runningStanzaId: string, updatedStanza: Models.Stanza) => {

        const stanzaURL = Models.Stanza.URLFromDocURL(documentURL, runningStanzaId);

        this.stanzas.set(stanzaURL, updatedStanza);

        this.patchStanza(stanzaURL, updatedStanza);
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

        fetchData(stanzaURL)
            .then(stanza => this.addStanzaToStore(stanzaURL, stanza))
            .then(() => { this.loadingStanzas.delete(stanzaURL); });
    }

    private patchStanza = (stanzaURL: string, updatedStanza: Models.Stanza) => {

        const topLevelLinks = {
            self: stanzaURL
        };

        const stanzaSerializer = Serializers.getStanzaSerializer("stanzas", topLevelLinks);

        const patchedStanza = JSON.stringify((stanzaSerializer.serialize(toJS(updatedStanza))));

        patchData(stanzaURL, patchedStanza);
    }
}
