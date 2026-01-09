import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupComponent} from "../../components/popup/popup.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  activeFragment: string | null = null;

  constructor(private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.activeFragment = fragment;
    });
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
