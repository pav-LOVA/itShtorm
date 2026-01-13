import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  isSubmitted: boolean = false;

  consultationForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor( private fb: FormBuilder,
               private dialogRef: MatDialogRef<PopupComponent>,
  ) { }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.consultationForm.valid) {
      this.isSubmitted = true;
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }

}
