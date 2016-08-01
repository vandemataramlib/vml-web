import * as React from "react";

import { PaperCustom } from "../shared/PaperCustom";

export class Home extends React.Component<any, any> {
    render() {

        return (
            <div className="row">
                <div className="col-xs-offset-2 col-xs-8">
                    <PaperCustom>
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>Welcome to Vande Mataram Library</h1>
                            </div>
                        </div>
                    </PaperCustom>
                </div>
            </div>
        );
    }
}
