import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: "root"
})
export class PromptUpdateService {

  constructor(private swUpdates: SwUpdate, private snackbar: MatSnackBar) {
    this.swUpdates.available.subscribe(event => {
      this.snackbar.open('Update Available', 'Reload', { duration: 5000 });
    });
  }
}