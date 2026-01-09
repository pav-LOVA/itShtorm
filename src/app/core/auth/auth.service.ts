import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {UserService} from "../../shared/services/user.service";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userInfoKey: string = 'userInfo';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  public userName$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient,
              private userService: UserService) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
    this.isLogged$.next(this.isLogged);

    if (this.isLogged) {
      const userInfoStorage = localStorage.getItem(this.userInfoKey);

      if (userInfoStorage) {
        const userInfo: UserInfoType = JSON.parse(userInfoStorage);
        this.userName$.next(userInfo.name);
      }
    }
  }

  private loadAndSaveUserInfo(): void {
    this.userService.getUserInfo().subscribe((data: DefaultResponseType | UserInfoType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.saveUserInfo(data as UserInfoType);
    });
  }

  public loadUserInfoAfterAuth(): void {
    this.loadAndSaveUserInfo();
  }

  login(email: string, password: string, rememberMe?: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {email, password, rememberMe})
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {name, email, password})
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => "Can't find token")
  }

  refresh():Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => "Can't use token");
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public saveUserInfo(userInfo: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    this.userName$.next(userInfo.name);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userInfoKey);
    this.isLogged = false;
    this.isLogged$.next(false);
    this.userName$.next('');
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  getUserInfo(): { id: string; name: string; email: string } | null {
    const userInfo = localStorage.getItem('userInfo');

    if (!userInfo) {
      return null;
    }

    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  }

  public getLoggedIn(): boolean {
    return this.isLogged;
  }

}
