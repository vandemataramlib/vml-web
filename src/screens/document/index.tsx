import * as React from "react";
import { withRouter } from "react-router";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Models } from "vml-common";

import { Context } from "../../shared/interfaces";
import { DocumentStore } from "../../stores";

import { Header } from "./Header";
import { Body } from "./Body";

interface DocumentProps {
    documentStore?: DocumentStore;
    params: any;
}

const doFetchData = (context: Context | DocumentProps, props: DocumentProps) => {

    return context.documentStore.getDocument(props.params.slug, props.params.subdocId, props.params.recordId);
};

@inject("documentStore")
@withRouter
@observer
export class Document extends React.Component<DocumentProps, {}> {
    static fetchData(context: Context, props: any) {

        return doFetchData(context, props);
    }

    componentDidMount() {

        doFetchData(this.props, this.props);
    }

    componentWillReceiveProps(nextProps) {

        doFetchData(nextProps, nextProps);
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
