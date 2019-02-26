import { FeedbackComponent } from './../feedback/feedback.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule, MaterialModule],
  declarations: [FeedbackComponent],
})
export class LayoutsModule {}
