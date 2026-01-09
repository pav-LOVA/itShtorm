import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {UserService} from "../../services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged = false;
  userName = '';

  isMenuOpen = false;

  activeFragment: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.activeFragment = fragment;
    });

    this.isLogged = this.authService.getLoggedIn();

    this.authService.isLogged$.subscribe(value => {
      this.isLogged = value;
    });

    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });

    const token = this.authService.getTokens().accessToken;
    if (token) {
      this.loadUserInfo();
    }
  }

  loadUserInfo() {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        if ((data as DefaultResponseType).error) {
          console.error('Ошибка получения информации о пользователе:', (data as DefaultResponseType).message);
          return;
        }
        const userInfo = data as UserInfoType;
        this.authService.saveUserInfo(userInfo);
      },
      error: (err) => console.error('Ошибка запроса пользователя:', err)
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.removeTokens();
    this.toggleMenu()
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

}
