import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupComponent} from "../../components/popup/popup.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ScrollService} from "../../services/scroll.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  activeFragment: string | null = null;

  constructor(private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.activeFragment = fragment;
      }
    });

    this.scrollService.scroll$.subscribe(fragment => {
      this.activeFragment = fragment;
    });
  }

  scrollToFragment(fragment: string) {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollService.scrollTo(fragment);
    } else {
      this.router.navigate(['/'], { fragment }).then(() => {
        this.scrollService.scrollTo(fragment);
      });
    }
  }

  openPopup(): void {
    this.dialog.open(PopupComponent, {
      width: '727px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
  }

}
