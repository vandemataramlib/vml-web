import { observable, computed, action } from "mobx";
import * as ExecutionEnvironment from "fbjs/lib/ExecutionEnvironment";

export enum Encoding {
    devanagari,
    iast,
    itrans
}

enum Environment {
    Server,
    Client
}

export class AppState {
    @observable currentUrl: string;
    @observable encoding: Encoding;
    defaultEncoding: Encoding = Encoding.itrans;
    @observable env: Environment;
    encodingSchemes = [
        {
            label: "देवनागरी",
            value: Encoding.devanagari
        },
        {
            label: "Roman",
            value: Encoding.iast
        }
    ];

    constructor(initialState?: AppState) {

        this.currentUrl = initialState ? initialState.currentUrl : "/";
        this.env = ExecutionEnvironment.canUseDOM ? Environment.Client : Environment.Server;
        if (this.isClientEnv && localStorage.getItem("encoding")) {
            this.encoding = parseInt(localStorage.getItem("encoding"));
        } else {
            this.encoding = Encoding.devanagari;
        }
    }

    @computed
    get isClientEnv() {

        return this.env === Environment.Client;
    }

    @computed
    get encodingScheme() {

        return this.encodingSchemes.filter(scheme => scheme.value === this.encoding)[0];
    }

    @action
    setCurrentUrl(url) {

        this.currentUrl = url;
    }

    @action
    changeEncoding(encoding: Encoding) {

        this.encoding = encoding;
        if (ExecutionEnvironment.canUseDOM) {
            localStorage.setItem("encoding", encoding.toString());
        }
    }
}
