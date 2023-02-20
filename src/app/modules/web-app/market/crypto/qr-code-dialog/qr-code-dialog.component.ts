import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html'
})
export class QrCodeDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<QrCodeDialogComponent>,) { }

  ngOnInit(): void {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Save and close
   */
  close(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

}
