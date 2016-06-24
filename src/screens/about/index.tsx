import * as React from "react";
import PaperCustom from "../shared/PaperCustom";

export default class About extends React.Component<any, any> {
    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>About the Vande Mataram Library</h1>
                            </div>
                        </div>
                    </PaperCustom>
                </div>
            </div>
        );
    }
}
