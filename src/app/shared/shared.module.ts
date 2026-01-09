import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoaderComponent} from "./components/loader/loader.component";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommentsComponent } from './components/comments/comments.component';
import { PopupComponent } from './components/popup/popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ShortTextPipe } from './pipes/short-text.pipe';
import {FormatDatePipe} from "./pipes/format-date.pipe";
import {NgxMaskModule} from 'ngx-mask';


@NgModule({
  declarations: [
    LoaderComponent,
    CommentsComponent,
    PopupComponent,
    PrivacyComponent,
    ShortTextPipe,
    FormatDatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    LoaderComponent,
    CommentsComponent,
    PopupComponent,
    PrivacyComponent,
    ShortTextPipe,
    FormatDatePipe,
  ],
})
export class SharedModule { }
