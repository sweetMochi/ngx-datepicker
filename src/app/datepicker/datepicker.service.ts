import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { formatDate } from '@angular/common';


// 功能資源
import { DatepickerUnit, DatepickerBoot, DatepickerSelectOption } from './datepicker';
import { DATEPICKER_YEAR_RANGE } from './datepicker';
import { DATE_FORMATE, DATE_LOCALE } from '../@set/set.const';


/**
 * 小月曆函式庫
 */
@Injectable({
	providedIn: 'root'
})
export class DatepickerService {

	/** 當前日期 */
	date = new Date();

	/** 啟動小日曆事件 */
	init = new Subject<DatepickerBoot>();

	/**
	 * 小日曆僅供關注事件
	 * 不可使用 next 改變傳入值
	 */
	run = this.init.asObservable();

	constructor() {}


	/**
	 * 判斷當前日期是否超出範圍 (可以等於當前日期)
	 * @param now 當前日期
	 * @param min 最小日期
	 * @param max 最大日期
	 */
	dayOff( now: Date, min: Date | null = null, max: Date | null = null ): boolean {

		// 當前日期基準
		const nowDate = new Date(now.getTime()).setHours(0, 0, 0, 0);

		// 任一條件超出範圍，則返回 true
		return (
			// 如果有最小日期，則進行比較
			( !!min && nowDate < new Date(min.getTime()).setHours(0, 0, 0, 0) )
			||
			// 如果有最大日期，則進行比較
			( !!max && nowDate > new Date(max.getTime()).setHours(0, 0, 0, 0) )
		);
	}


	/**
	 * 更新月曆
	 * @param start 當前日期
	 * @param view 檢視日期
	 * @param min 最小日期
	 * @param max 最大日期
	 */
	update( start: string[], view: Date, min: Date | null = null, max: Date | null = null ): DatepickerUnit[] {

		// 選取日期預設值
		start = start ? start : [];

		// 清空陣列
		const seeDate: DatepickerUnit[] = [];

		// 製作月曆當前範圍的資訊
		// getMonth 起始數值為 0（ 1 月  = 0 ）
		// new Date(y, m, d) d 為 0 表示為上個月的最後一天
		const see = {
			year: view.getFullYear(),
			month: view.getMonth(),
			day: view.getDate(),
			// 補充天數，使月曆固定有 49 格
			sup: 0,
			// 當月最大天數
			max: new Date(view.getFullYear(), view.getMonth() + 1 , 0).getDate(),
			// 上個月的日期
			preMonth: new Date(view.getFullYear(), view.getMonth(), 1).getDay(),
			// 下個月的日期
			nextMonth: new Date(view.getFullYear(), view.getMonth() + 1, 0).getDay()
		};

		// 如果月曆週數小於 6 周
		if ( see.max + see.preMonth + ( 6 - see.nextMonth ) < ( 7 * 6 ) ) {
			// 補充天數增加 1 周
			see.sup = 7;
		}

		// 依照星期，補齊上個月的天數
		// out: 不是當前月的日期
		// now: 今天日期
		// off: 是否在限制日期範圍內
		for (let i = see.preMonth - 1; i >= 0 ; i--) {
			const now = new Date(see.year, see.month, 0 - i);
			const date = formatDate(now, DATE_FORMATE, DATE_LOCALE);
			seeDate.push(
				new DatepickerUnit(
					date,
					now.getFullYear(),
					now.getMonth() + 1,
					now.getDate(),
					now.getDay(),
					false,
					true,
					this.dayOff(now, min, max)
				)
			);
		}

		// 製作當月的月曆天數
		// sdate: 當前選取日期
		for (let j = 0; j < see.max; j++) {
			const now = new Date(see.year, see.month, j + 1);
			const date = formatDate(now, DATE_FORMATE, DATE_LOCALE);
			const sdate = start.map( item => {
				return formatDate(new Date(item), DATE_FORMATE, DATE_LOCALE);
			});

			seeDate.push(
				new DatepickerUnit(
					date,
					now.getFullYear(),
					now.getMonth() + 1,
					now.getDate(),
					now.getDay(),
					sdate.indexOf(date) > -1,
					false,
					this.dayOff(now, min, max)
				)
			);
		}

		// 依照星期，補齊下個月的天數
		for (let k = 0; k < 6 - see.nextMonth + see.sup; k++) {
			const now = new Date(see.year, see.month + 1, k + 1);
			const date = formatDate(now, DATE_FORMATE, DATE_LOCALE);
			seeDate.push(
				new DatepickerUnit(
					date,
					now.getFullYear(),
					now.getMonth() + 1,
					now.getDate(),
					now.getDay(),
					false,
					true,
					this.dayOff(now, min, max)
				)
			);
		}

		return seeDate;
	}


	/**
	 * 年份範圍
	 * @param dateMin 最小日期
	 * @param dateMax 最大日期
	 */
	yearRange( dateMin: Date | null = null, dateMax: Date | null = null ): DatepickerSelectOption[] {

		// 年份重置
		const selectYear: DatepickerSelectOption[] = [];
		// 預設最大日期
		const maxYear = this.date.getFullYear() + DATEPICKER_YEAR_RANGE;

		let min = this.date.getFullYear();
		let max = maxYear;

		// 如果有指定最大和最小日期
		if ( dateMin && dateMax ) {
			min = dateMin.getFullYear();
			max = this.date.getFullYear();
		} else {

			// 如果只有最小日期
			if ( dateMin ) {
				// 檢查是否為過去的日期
				min = dateMin.getFullYear() - this.date.getFullYear() > 0 ? dateMin.getFullYear() : this.date.getFullYear();
				// 換算最大日期
				max = min + DATEPICKER_YEAR_RANGE;
			}

			// 如果只有最大日期
			if ( dateMax ) {
				// 檢查是否為過去的日期
				max = dateMax.getFullYear() - this.date.getFullYear() > 0 ? dateMax.getFullYear() : maxYear;
				// 換算最小日期
				min = max - DATEPICKER_YEAR_RANGE;
			}

		}


		// 產生年份選單
		for (let i = min; i < max; i++) {
			selectYear.push(
				new DatepickerSelectOption(
					i,
					i.toString()
				)
			);
		}

		return selectYear;
	}


	/**
	 * 月份範圍
	 */
	monthRange(): DatepickerSelectOption[] {
		return new Array(12).fill(0).map( ( item, i ) => {
			return new DatepickerSelectOption(
				i,
				( i + 1 ).toString()
			);
		});
	}

}
