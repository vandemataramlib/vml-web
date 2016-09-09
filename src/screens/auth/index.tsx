import * as React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";

import { AuthStore } from "../../stores";

interface LoginProps {
    location: any;
    authStore?: AuthStore;
}

@inject("authStore")
@observer
export class Login extends React.Component<LoginProps, {}> {
    render() {

        const { authStore } = this.props;

        return (
            <div>
                <h2>Login</h2>
                { !authStore.loggedIn ? <button onClick={ authStore.login }>Login</button> : <button onClick={ authStore.logout }>Logout { authStore.profile.name }</button>}
            </div>
        );
    }
}
