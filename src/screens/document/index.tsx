import * as React from "react";
import { observer, inject } from "mobx-react";

import { Context } from "../../shared/interfaces";
import { DocumentStore, AppState } from "../../stores";

import { Header } from "./Header";
import { Body } from "./Body";

interface DocumentProps {
    documentStore?: DocumentStore;
    params: any;
    appState?: AppState;
}

const doFetchData = (context: Context | DocumentProps, props: DocumentProps) => {

    return context.documentStore.getDocument(props.params.slug, props.params.subdocId, props.params.recordId);
};

@inject("documentStore", "appState")
@observer
export class Document extends React.Component<DocumentProps, {}> {
    static fetchData(context: Context, props: any) {

        return doFetchData(context, props);
    }

    componentDidMount() {

        doFetchData(this.props, this.props);
        const { appState } = this.props;
        const hash: string = (appState.currentLocation as any).hash;
        appState.selectStanzasFromHash(hash);
        const hashRegex = /(?:^#p)([\d-,]*\d$)/g;
        if (hash.match(hashRegex)) {

            const firstElementId = hash.split(",")[0].split("-")[0];
            setTimeout(() => {

                const firstSelectedEl = document.querySelector(firstElementId);
                firstSelectedEl && window.scrollTo(0, (firstSelectedEl as HTMLElement).offsetTop);
            }, 1000);
        }
    }

    componentWillReceiveProps(nextProps) {

        doFetchData(nextProps, nextProps);
        const { appState } = this.props;
        appState.selectStanzasFromHash((appState.currentLocation as any).hash);
    }

    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <Header />
                    <Body />
                </div>
            </div>
        );
    }
}
