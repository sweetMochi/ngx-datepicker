import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

// 系統資源
import { DateFormate } from '../@set/set.const';
import {
	DATE_FORMATE,
	DATE_M_D_FORMATE,
	DATE_TIME_FORMATE,
	DATE_LOCALE
} from '../@set/set.const';

@Injectable({
	providedIn: 'root'
})
export class DateService {

	constructor() { }

	/**
	 * [F] 檢查是否為正確日期格式
	 * @param [date] 日期
	 */
	isDate(date: string) {
		// 如果沒有傳入日期
		if ( !date ) {
			return false;
		}
		const d = new Date(date);
		// 跨瀏覽器檢測型別、如果是 Invalid Date，使用 Number.isNaN 檢查
		// stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
		// stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
		return Object.prototype.toString.call(d) === '[object Date]' && !Number.isNaN(Number(d));
	}


	/**
	 * 後端日期轉換成字串
	 * @param jsondate '/Date("123456789")/' => '123456789'
	 */
	jsondate(jsondate: string): string {
		// adding a default format in case you don't want to pass the format
		// then 'yyyy-MM-dd' will be used
		// stackoverflow.com/questions/52606333/how-i-can-create-angular-custom-date-pipe
		// stackoverflow.com/questions/206384/how-do-i-format-a-microsoft-json-date
		return jsondate ? parseInt(jsondate.substr(6), 10).toString() : null;
	}


	/**
	 * 日期格式化為系統格式
	 * @param day 轉換對象
	 */
	dateFormat( date ) {
		return formatDate(date, DATE_FORMATE, DATE_LOCALE);
	}


	/**
	 * 日期格式化
	 * @param day 日期 /Date("123456789")/
	 * @param type 格式化類型
	 */
	format( day: string, type: DateFormate ): string {

		// 回傳日期
		let date = null;

		// 如果有「傳入日期」和「格式化類型」
		if ( day ) {
			// 判斷格式化條件
			switch (true) {
				case type === 'date':
					date = formatDate(this.jsondate(day), DATE_FORMATE, DATE_LOCALE);
					break;
				case type === 'm-d':
					date = formatDate(this.jsondate(day), DATE_M_D_FORMATE, DATE_LOCALE);
					break;
				case type === 'time':
					date = formatDate(this.jsondate(day), DATE_TIME_FORMATE, DATE_LOCALE);
					break;
			}
		}

		return date;

	}

}
