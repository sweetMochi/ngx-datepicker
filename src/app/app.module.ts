import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DatepickerDirective } from './datepicker/datepicker.directive';


@NgModule({
	declarations: [
		AppComponent,
		DatepickerComponent,
		DatepickerDirective
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
