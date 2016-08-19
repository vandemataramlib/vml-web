import * as React from "react";
import { Dialog, FlatButton, SelectField, MenuItem, Divider, TextField } from "material-ui";
import { observer, inject } from "mobx-react";
import { observable, action, computed } from "mobx";
import { Models } from "vml-common";

import { AppState, CollectionStore, DocumentStore } from "../../stores";
import { SelectedCollection, CollectionDialogRefs } from "../../shared/interfaces";

interface CollectionDialogProps {
    open: boolean;
    onRequestClose: (clicked: boolean, resetSelection?: boolean) => void;
    appState?: AppState;
    collectionStore?: CollectionStore;
    documentStore?: DocumentStore;
}

@inject("appState", "collectionStore", "documentStore")
@observer
export class CollectionDialog extends React.Component<CollectionDialogProps, {}> {
    @observable selectedCollection: SelectedCollection = { id: null, title: null };
    componentRefs: CollectionDialogRefs = {};
    editMode: boolean = false;

    componentWillReceiveProps() {

        this.setSelectedCollection({ id: null, title: null });
    }

    @action
    setSelectedCollection(selectedCollection: SelectedCollection) {

        this.selectedCollection.id = selectedCollection.id;
    }

    @computed
    get showNewCollectionField() {

        return this.selectedCollection.id === "-1";
    }

    handleUpdateCollections = (event) => {

        const { collectionStore, documentStore, appState } = this.props;

        if (this.editMode) {
            collectionStore.tryUpdatingCollection(documentStore, this.selectedCollection.id);
        }
        else {
            const collectionTitle = this.componentRefs.collectionName.getValue().trim();

            if (collectionTitle === "") {
                event.stopPropagation();
                return;
            }

            collectionStore.tryCreatingCollection(documentStore, this.componentRefs);
        }

        this.props.onRequestClose(event, true);
    }

    handleSelectionChanged = (event, index: number, value: string) => {

        const title = value !== "-1" ? this.props.collectionStore.collections.get(value).title : null;

        this.setSelectedCollection({ id: value, title });

        if (value === "-1") {
            this.editMode = false;
            setTimeout(() => this.componentRefs.collectionName.focus(), 200);
        }
        else {
            this.editMode = true;
        }
    }

    getDialogChildren(): JSX.Element {

        const { collectionStore } = this.props;

        const items = collectionStore.collectionList.map(item => {

            return <MenuItem
                value={ item.id }
                primaryText={ item.title }
                key={ item.id }
                />;
        });

        if (items.length > 0) {
            items.push(<Divider key="-2" />);
        }

        items.push(<MenuItem key="-1" value="-1" primaryText="Create new..." />);

        return (
            <div>
                <SelectField
                    value={ this.selectedCollection.id }
                    onChange={ this.handleSelectionChanged }
                    floatingLabelText="Collection name"
                    fullWidth
                    maxHeight={ 300 }
                    >
                    { items }
                </SelectField>
                {
                    this.showNewCollectionField &&
                    <div>
                        <TextField
                            floatingLabelText="New collection name"
                            ref={ (collectionName) => this.componentRefs.collectionName = collectionName }
                            fullWidth
                            errorText="Required"
                            />
                        <TextField
                            floatingLabelText="Description"
                            rows={ 4 }
                            multiLine
                            ref={ (collectionDesc) => this.componentRefs.collectionDesc = collectionDesc }
                            fullWidth
                            />
                    </div>
                }
            </div>
        );
    }

    getDialogActions(): JSX.Element[] {

        return [
            <FlatButton
                label="Cancel"
                secondary
                onTouchTap={ (event) => this.props.onRequestClose(false) }
                />,
            <FlatButton
                label="Save"
                primary
                onTouchTap={ this.handleUpdateCollections }
                />
        ];
    }

    render() {

        const styles = getStyles();

        const { open, onRequestClose } = this.props;

        return (
            <Dialog
                title="Add selected to Collection"
                open={ open }
                onRequestClose={ onRequestClose }
                children={ open && this.getDialogChildren() }
                actions={ open && this.getDialogActions() }
                contentStyle={ styles.contentStyle }
                autoScrollBodyContent
                />
        );
    }
}

function getStyles() {

    const styles = {
        contentStyle: {
            width: "40%"
        }
    };

    return styles;
}
