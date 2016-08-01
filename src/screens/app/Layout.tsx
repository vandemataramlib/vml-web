import * as React from "react";
import { observer } from "mobx-react";

const styles = {
    self: {
        paddingTop: 60,
        paddingBottom: 60
    }
};

@observer
export default class Layout extends React.Component<{}, {}> {
    render() {

        return (
            <div className="container" style={ styles.self }>{ this.props.children }</div>
        );
    }
}
