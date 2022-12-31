import {Component, Inject, OnInit} from '@angular/core';

import authConfig from "../../config/auth-config";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import OktaSignIn from '@okta/okta-signin-widget'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    oktaSignin: any;

    constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
        this.oktaSignin = new OktaSignIn({
            logo: 'assets/images/logo.png',
            baseUrl: authConfig.oidc.issuer.split('/oauth2')[0],
            clientId: authConfig.oidc.clientId,
            redirectUri: authConfig.oidc.redirectUri,
            authParams: {
                pkce: true, // Proof Key for Code Exchange
                issuer: authConfig.oidc.issuer,
                scopes: authConfig.oidc.scopes,
            }
        });
    }

    ngOnInit(): void {
        this.oktaSignin.remove();

        this.oktaSignin.renderEl(
            {
                el: '#okta-signin-widget',     // should be same as the div tag field in login.component.html
            },
            (response: any) => {
                if (response.status === 'SUCCESS') {
                    this.oktaAuth.signInWithRedirect();
                }
            },
            (err: any) => {
                throw err;
            }
        );
    }

}
