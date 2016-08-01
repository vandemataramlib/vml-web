import * as React from "react";
import { Paper } from "material-ui";

const styles = {
    self: {
        minHeight: 1000,
        padding: 40
    }
};

export class PaperCustom extends React.Component<any, any> {
    render() {

        return (
            <Paper style={ styles.self }>{ this.props.children }</Paper>
        );
    }
}
