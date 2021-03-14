import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {
	@ViewChild('topLeft') topLeft: ElementRef;

	date: string;
	dateTopLeft: string;
	dateTopRight: string;
	dateBottomLeft: string;
	dateBottomRight: string;
}
