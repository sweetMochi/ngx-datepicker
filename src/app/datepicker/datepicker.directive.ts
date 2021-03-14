import { HostBinding, Input, Output, Directive, HostListener, EventEmitter } from '@angular/core';
import { NgModel } from '@angular/forms';


// 功能資源
import { DateService } from 'src/app/@sup/date.service';
import { DatepickerBoot } from './datepicker';
import { DatepickerService } from './datepicker.service';


/**
 * 小月曆
 */
@Directive({
	selector: '[appDatepicker][ngModel]'
})
export class DatepickerDirective {

	/** 欄位名稱 */
	@Input() name: string;

	/** input type */
	@Input() type: string;

	/** 最小日期 */
	@Input('appDatepickerMin') min: string;

	/** 最大日期 */
	@Input('appDatepickerMax') max: string;

	/** 回調事件 */
	@Output() action = new EventEmitter<string>();

	/** 手機版禁用原生小日曆 */
	@HostBinding() readonly = true;

	constructor(
		private date: DateService,
		private ngModel: NgModel,
		private datepicker: DatepickerService
	) { }


	/**
	 * [E] 日期驗證與初始化
	 * @param [date] 傳入日期
	 */
	initDate(date: string): string {
		if ( !date ) {
			return null;
		}
		return this.date.isDate(date) ? date : null;
	}


	@HostListener('focus', ['$event'])
	init(event: FocusEvent): void {

		// 檢查 input type
		if ( this.type !== 'date' ) {
			console.log('[Datepicker] Datepicker need "date" type input.');
			return;
		}

		// 不顯示原生小日曆
		event.preventDefault();

		// 最小日期初始化
		this.min = this.initDate(this.min);

		// 最大日期初始化
		this.max = this.initDate(this.max);

		// 如果同時傳入最小日期和最大日期
		if ( this.min && this.max ) {
			// 最小日期必須大於最大日期
			if ( new Date(this.min) > new Date(this.max) ) {
				console.log('[Datepicker] Date range ( min value is greater than max value ) is not allowed.');
				return;
			}
		}

		// 輸入框型別判斷
		const target = event.target as HTMLInputElement;

		// 小月曆傳入值
		this.datepicker.init.next(
			new DatepickerBoot(
				this.name,
				target,
				this.ngModel,
				this.min,
				this.max,
				this.action
			)
		);
	}
}
