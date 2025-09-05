import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DatepickerDirective } from './datepicker/datepicker.directive';

@Component({
    selector: 'app-root',
    imports: [
        FormsModule,
        DatepickerComponent,
        DatepickerDirective
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent {

    date = '';
    dateTopLeft = '';
    dateTopRight = '';
    dateBottomLeft = '';
    dateBottomRight = '';

}
