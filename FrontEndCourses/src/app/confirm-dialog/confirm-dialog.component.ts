import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      Are you sure?
    </h2>
    <div mat-dialog-content>
      <p>Do you want to {{ data.action }} this {{ data.item }}?</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Yes, {{ data.action }} it!</button>
    </div>
  `,
  styles: [
    `
      mat-icon {
        vertical-align: middle;
        margin-right: 8px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { action: string; item: string },
      public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}
}
