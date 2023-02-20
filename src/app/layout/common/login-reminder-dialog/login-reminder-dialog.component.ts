import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'app-login-reminder-dialog',
  templateUrl: './login-reminder-dialog.component.html'
})
export class LoginReminderDialogComponent implements OnInit, OnDestroy {
  countdown: number = 30;
  countdownMapping: any = {
    'other': '# seconds'
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _isStay = false;

  constructor(
    public matDialogRef: MatDialogRef<LoginReminderDialogComponent>,
    private _router: Router,
    private _authService: AuthService,) { }

  ngOnInit(): void {

    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          if (!this._isStay) {
            this.gotoLogin();
          }
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--)
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign out & Redirect to login
   */
  gotoLogin(): void {
    this._authService.signOut();
    this.close();
    this._router.navigate(['sign-in']);
  }

  /**
   * Stay
   */
  onStay(): void {
    this._isStay = true;
    this.close();
  }

  /**
   * Save and close
   */
  close(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
