
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionsObservable } from 'redux-observable';

import { HttpService } from './../services/http';
import { AuthActions } from './../action/auth';
import { api } from './api';

@Injectable()
export class AuthEpics {
    constructor(private hs: HttpService) { }
    login = (action$: ActionsObservable<any>) =>
        action$.ofType(AuthActions.LOGIN)
            .switchMap(({ payload }) => {
                return this.hs.PostRequest(api.login, payload)
                    .switchMap(result => {
                        if (result.success) {
                            return Observable.concat(
                                Observable.of({
                                    type: AuthActions.LOGIN_SUCCESS,
                                    payload: <any>result
                                })
                            )
                        } else {
                            return Observable.concat(
                                Observable.of({
                                    type: AuthActions.LOGIN_FAIL,
                                    payload: <any>result.error
                                })
                            )
                        }
                    })
                    .catch(error =>
                        Observable.concat(
                            Observable.of({
                                type: AuthActions.LOGIN_FAIL,
                                payload: <any>'Error: ' + error
                            })
                        )
                    )
            });

    register = (action$: ActionsObservable<any>) =>
        action$.ofType(AuthActions.REGISTER)
            .switchMap(({ payload }) => {
                return this.hs.PostRequest('/api/users', payload)
                    .switchMap(result => {
                        if (result.success) {
                            return Observable.of({
                                type: AuthActions.REGISTER_SUCCESS,
                                payload: <any>result
                            })
                        } else {
                            return Observable.of({
                                type: AuthActions.REGISTER_FAIL,
                                payload: <any>result
                            })
                        }
                    })
                    .catch(error => Observable.of({
                        type: AuthActions.REGISTER_FAIL,
                        payload: <any>'Error: ' + JSON.stringify(error)
                    }))
            });

}