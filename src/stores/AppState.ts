import { observable, computed, action, ObservableMap, map } from "mobx";
import * as ExecutionEnvironment from "fbjs/lib/ExecutionEnvironment";

import { Encoding, Environment, FetchLevel } from "../shared/interfaces";
import { encodingSchemes } from "../shared/constants";

let instance: AppState = null;

export class AppState {
    @observable currentUrl: string;
    @observable encoding: Encoding = Encoding.devanagari;
    defaultEncoding: Encoding = Encoding.itrans;
    @observable env: Environment;
    @observable dataFetchStore: ObservableMap<FetchLevel>;

    constructor(initialState?: AppState) {

        if (!instance) {
            instance = this;
        }

        this.currentUrl = initialState ? initialState.currentUrl : "/";
        this.env = ExecutionEnvironment.canUseDOM ? Environment.Client : Environment.Server;
        if (this.isClientEnv) {
            this.dataFetchStore = map({});
            let encodingFromStorage = localStorage.getItem("encoding");
            if (encodingFromStorage) {
                this.setEncoding(parseInt(localStorage.getItem("encoding")));
            }
        }

        return instance;
    }

    @action
    addFetch = (url: string, level: FetchLevel) => {

        this.dataFetchStore.set(url, level);
    }

    @action
    deleteFetch = (url: string) => {

        this.dataFetchStore.delete(url);
    }

    @computed
    get pendingAppFetches() {

        return this.dataFetchStore.values().filter(url => url === FetchLevel.App);
    }

    @computed
    get isClientEnv() {

        return this.env === Environment.Client;
    }

    @computed
    get encodingScheme() {

        return encodingSchemes.filter(scheme => scheme.value === this.encoding)[0];
    }

    @action
    setCurrentUrl(url) {

        this.currentUrl = url;
    }

    @action
    setEncoding(encoding: Encoding) {

        this.encoding = encoding;
        if (ExecutionEnvironment.canUseDOM) {
            localStorage.setItem("encoding", encoding.toString());
        }
    }
}
