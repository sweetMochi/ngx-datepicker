import { NgModel } from '@angular/forms';
import { EventEmitter } from '@angular/core';

/**
 * 月曆前後年份範圍
 */
export const DATEPICKER_YEAR_RANGE = 10;


/**
 * 星期簡寫
 */
export const DATEPICKER_WEEK_ABBR = ['Sun', 'Mon', 'Tus', 'Wed', 'Thr', 'Fir', 'Sat'];


/**
 * 日期單位格式
 */
export class DatepickerUnit {
	constructor(
		/** 當前日期 (YYYY-MM-DD) */
		public date: string,
		/** 年份 */
		public y: number,
		/** 月份 */
		public m: number,
		/** 日期 */
		public d: number,
		/** 星期 */
		public w: number,
		/** 當日 */
		public sdate: boolean,
		/** 當月 */
		public out: boolean,
		/** 禁用 */
		public off: boolean
	) {}
}


/**
 * 下拉選單項目
 */
export class DatepickerSelectOption {
	constructor(
		/** 儲存值 */
		public val: number,
		/** 顯示值 */
		public title: string,
	) {}
}


/**
 * 日期資訊傳遞格式
 */
export class DatepickerBoot {
	constructor(
		/** 欄位名稱 */
		public name: string,
		/** 輸入框本體 */
		public input: HTMLInputElement,
		/** 開始日期 */
		public date: NgModel,
		/** 最小日期 */
		public min: string,
		/** 最大日期 */
		public max: string,
		/** 回調函式 */
		public action: EventEmitter<string>
	) {}
}
