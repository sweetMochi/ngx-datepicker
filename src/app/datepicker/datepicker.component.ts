import { Component, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';

// 功能資源
import { DatepickerService } from './datepicker.service';
import { DatepickerBoot, DatepickerSelectOption, DatepickerUnit } from './datepicker';
import { DATEPICKER_WEEK_ABBR } from './datepicker';
import { DATE_FORMATE, DATE_LOCALE, MOBILE_WIDTH } from '../@set/set.const';
import { DateService } from '../@sup/date.service';
import { formatDate } from '@angular/common';


/**
 * 小月曆本體
 */
@Component({
	selector: 'app-datepicker',
    imports: [
        FormsModule
    ],
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.less']
})
export class DatepickerComponent implements OnInit {
	@ViewChild('panel', { static: true}) public panel!: ElementRef;

	/** 是否開啟 */
	private active = false;

	/** 更新對象 */
	ngModel: NgModel | null = null;

	/** 月曆每日資訊 */
	seeDate: DatepickerUnit[] = [];

	/** 當前年份 */
	year = 0;

	/** 當前月份 */
	month = 0;

	/** 年份選擇 */
	selectYear: DatepickerSelectOption[] = [];

	/** 月份選擇 */
	selectMonth: DatepickerSelectOption[] = [];

	/** 輸入日期 */
	sdate = '';

	/** 最小日期 */
	min = '';

	/** 最大日期 */
	max = '';

	/** 今天日期 */
	now = new Date();

	/** 檢視日期 */
	date = new Date();

	/** 最小日期 */
	dateMin: Date | null = new Date();

	/** 最大日期 */
	dateMax: Date | null = new Date();

	/** 星期簡寫 */
	week = DATEPICKER_WEEK_ABBR;

	/** 月曆浮動位置 */
	top = 0;
	left = 0;

	/** 輸入框資訊 */
	input: HTMLInputElement | null = null;

	/** 回調函式 */
	action = new EventEmitter<string>();

	constructor(
		private router: Router,
		private dateService: DateService,
		private datepicker: DatepickerService
	) { }

	/**
	 * [E] datepicker running
	 * @param data init passing data
	 */
	init( data: DatepickerBoot ) {

		// 更新對象
		this.ngModel = data.date;

		// 定義輸入框實體
		this.input = data.input;

		// 回調函式
		this.action = data.action;

		// 指定當前日期
		// 若沒有日期，則顯示當前日期
		this.sdate = data.date.value ? data.date.value : formatDate(new Date(), DATE_FORMATE, DATE_LOCALE);

		// 如果有設定最小日期
		this.dateMin = this.dateService.isDate(data.min) ? new Date(data.min) : null;

		// 如果有設定最大日期
		this.dateMax = this.dateService.isDate(data.max) ? new Date(data.max) : null;

		switch ( true ) {
			// 如果有設定最小日期，並且今天日期小於最小日期
			case this.dateMin && this.now < this.dateMin:
				// 設定今天日期為最小日期
				this.date = new Date(data.min);
				break;
			// 如果有設定最大日期，並且今天日期大於最大日期
			case this.dateMax && this.now > this.dateMax:
				// 設定今天日期為最大日期
				this.date = new Date(data.max);
				break;
		}

		// 更新日期
		this.update();

		// 更新空間資料
		this.rect();

		// 更新年份
		this.selectYear = this.datepicker.yearRange(this.dateMin, this.dateMax);

	}


	/**
	 * 更新月曆
	 */
	update(): void {
		this.year = this.date.getFullYear();
		this.month = this.date.getMonth();
		this.seeDate = this.datepicker.update([this.sdate], this.date, this.dateMin, this.dateMax);
	}


	/**
	 * 小月曆定位計算
	 */
	rect(): void {
		if ( this.input ) {
			// 顯示月曆
			this.show = true;
			// 輸入框空間維度
			const rect = this.input.getBoundingClientRect();
			// 小月曆本體
			const panel = this.panel.nativeElement as HTMLElement;
			// 在月曆顯示後更新高度資料
			const datepicker = panel.getBoundingClientRect();

			// 日曆 X 座標
			this.left = rect.left;

			// 超過螢幕高度，則改為往上彈出
			if ( ( rect.top + rect.height ) > ( window.innerHeight / 2 ) ) {
				// 更新顯示位置為輸入框向上彈出
				this.top = rect.top - datepicker.height - rect.height;
			} else {
				// 維度：輸入框高度、輸入框 Y 軸座標、捲動距離
				this.top = rect.top + rect.height + window.pageYOffset;
			}

			// 如果是桌機版
			if ( window.innerWidth > MOBILE_WIDTH ) {

				// 預設值
				this.left = rect.left;

				// 如果有載入資料後寬度的 HTML
				if ( panel ) {

					const width = panel.getBoundingClientRect().width;

					// 如果超出顯示範圍
					if ( rect.left + width > window.innerWidth ) {
						// 減去自己的寬度
						this.left = rect.left - width + rect.width;
					}

				}

			} else {
				// 手機版不使用 X 定位
				this.left = 0;
			}

		}
	}


	/**
	 * [E] 傳遞日期參數
	 * @param sdate 開始日期
	 */
	pick( sdate: string ): void {

		// 驗證日期格式
		if ( this.dateService.isDate(sdate) ) {

			// 設定開始日期
			this.sdate = sdate;

			// 當前日期更新為輸入日期
			this.date = new Date(this.sdate);

			// 更新小月曆
			this.update();

			// 傳送當前日期到輸入框
			this.ngModel?.update.emit(this.sdate);

			// 觸發回調
			this.action.emit(this.sdate);

			// 關閉月曆
			this.show = false;

		} else {
			console.log('[datepicker] Date is not valid.');
		}
	}


	/**
	 * 月曆是否顯示
	 * @param active 是否顯示
	 */
	set show( active: boolean ) {
		// 顯示狀態
		this.active = active;
	}
	get show() {
		return this.active;
	}


	/**
	 * 變更年份
	 */
	changeYear() {
		this.date.setFullYear(this.year);
		this.update();
	}


	/**
	 * 變更月份
	 * @param m 月份往前/往後
	 */
	changeMonth( m?: number ) {
		// 如果有傳入往前或後
		// 將往前或往後的值加到當前的月份
		// 如果沒有輸入，則取當前選取的月份
		this.date.setMonth( m ? this.date.getMonth() + m : this.month );
		// 更新小月曆
		this.update();
	}


	/**
	 * 清除當前日期
	 */
	clear() {
		// 清空當前日期
		this.sdate = '';
		// 清空輸入框日期
		this.ngModel?.update.emit('');
		// 回調函式
		this.action.emit('');
		// 關閉月曆
		this.show = false;
	}

	/**
	 * [E] 縮放事件
	 */
	onResize() {
		if ( this.show ) {
			// 更新空間資料
			this.rect();
		}
	}

	ngOnInit() {

		// 產生月份選單
		this.selectMonth = this.datepicker.monthRange();

		// 產生年份選單
		this.selectYear = this.datepicker.yearRange();

		// 預先生成小月曆
		this.seeDate = this.datepicker.update([], this.date);

		// 當小月曆傳入資料的時候
		this.datepicker.run.subscribe( data => {
			// 如果有傳入資料
			if ( data ) {
				this.init(data);
			}
		});

		// [E] 路由事件
		this.router.events.subscribe((event: Event) => {
			// 導向完成：Route 為跳轉後頁面
			if ( event instanceof NavigationEnd ) {
				// 隱藏選擇日期功能
				this.show = false;
			}
		});
	}
}
