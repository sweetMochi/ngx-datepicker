import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatepickerComponent } from './@view/datepicker/datepicker.component';
import { DatepickerDirective } from './@view/datepicker/datepicker.directive';


@NgModule({
	declarations: [
		AppComponent,
		DatepickerDirective,
		DatepickerComponent
	],
	imports: [
		FormsModule,
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
