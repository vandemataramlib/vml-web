import * as React from "react";
import { withRouter } from "react-router";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";

import { RouterRenderedComponent } from "../../interfaces/component";
import { Context } from "../../interfaces/context";
import { DocumentStore, Document as DocumentModel } from "../../stores/documents";
import { AppState } from "../../stores/appState";

import { Header } from "./Header";
import { Body } from "./Body";

interface DocumentProps {
    documentStore?: DocumentStore;
    params: any;
}

const doFetchData = (context: Context | DocumentProps, props: DocumentProps) => {

    return context.documentStore.showDocument(props.params.slug, props.params.subdocId, props.params.recordId);
};

@inject("documentStore")
@withRouter
@observer
class Document extends React.Component<DocumentProps, {}> {
    @observable annotateMode: boolean = false;

    static fetchData(context: Context, props: any) {

        return doFetchData(context, props);
    }

    componentDidMount() {

        doFetchData(this.props, this.props);
    }

    componentWillReceiveProps(nextProps) {

        doFetchData(nextProps, nextProps);
    }

    handleAnnotateToggle = (event, value) => {

        this.annotateMode = value;
    }

    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <Header
                        onAnnotateToggle={ this.handleAnnotateToggle }
                        annotateMode={ this.annotateMode }
                        />
                    <Body
                        annotateMode={ this.annotateMode }
                        />
                </div>
            </div>
        );
    }
}

export default Document as RouterRenderedComponent;
