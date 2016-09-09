import { observable, action, computed } from "mobx";
const Auth0Lock = require("auth0-lock").default;
const decode = require("jwt-decode");

let instance: AuthStore = null;
const ID_TOKEN = "idToken";
const PROFILE = "profile";

export class AuthStore {
    lock: any;
    @observable profile: any;
    @observable token: any;

    static getInstance(initialState?: any) {

        if (!instance) {
            instance = new AuthStore(initialState);
        }

        return instance;
    }

    constructor(initialState?: any) {


        // this.lock = initialState ? new Auth0Lock(initialState.clientId, initialState.domain, {}) : null;
        this.lock = initialState ? new Auth0Lock(initialState.clientId, initialState.domain, {}) : (instance ? instance.lock : null);
        this.lock && this.lock.on("authenticated", this.doAuthentication);
        this.token = this.getTokenFromLocalStorage();
        this.profile = this.getProfileFromLocalStorage();

        // if (!instance) {
        //     instance = this;
        // }
        // return instance;
    }

    doAuthentication = (authResult) => {
        // Saves the user token
        this.setTokenToLocalStorage(authResult.idToken);
        this.setToken(authResult.idToken);
        this.lock.getProfile(authResult.idToken, (error: Error, profile) => {

            if (error) {
                console.log("Error loading profile", error.message);
                return;
            }

            this.setProfile(profile);
            this.setProfileToLocalStorage(profile);
        });
    }

    @action
    setToken = (idToken: any) => {

        this.token = idToken;
    }

    @action
    setProfile = (profile: any) => {

        this.profile = profile;
    }

    setProfileToLocalStorage(profile) {

        localStorage.setItem(PROFILE, JSON.stringify(profile));
    }

    getProfileFromLocalStorage() {

        const profile = localStorage.getItem(PROFILE);
        return profile ? JSON.parse(profile) : {};
    }

    setTokenToLocalStorage(idToken) {
        // Saves user token to localStorage
        localStorage.setItem(ID_TOKEN, idToken);
    }

    getTokenFromLocalStorage() {
        // Retrieves the user token from localStorage
        return localStorage.getItem(ID_TOKEN);
    }

    login = () => {
        // Call the show method to display the widget.
        this.lock.show();
    }

    @computed
    get loggedIn() {
        // Checks if there is a saved token and it's still valid
        // if (!this.token) {
        //     this.setToken(this.getTokenFromLocalStorage());
        // }
        return !!this.token && !this.isTokenExpired();
    }

    logout = () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem(ID_TOKEN);
        localStorage.removeItem(PROFILE);
        this.setToken(null);
        this.setProfile(null);
    }

    getTokenExpirationDate = (token: any) => {

        const decoded = decode(token);

        if (!decoded.exp) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired = () => {

        const date = this.getTokenExpirationDate(this.token);

        if (!date) {
            return false;
        }

        const offsetSeconds = 0;
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}
