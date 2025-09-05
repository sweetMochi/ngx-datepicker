import { TestBed } from '@angular/core/testing';

import { DatepickerService } from './datepicker.service';
import { DATEPICKER_YEAR_RANGE, DatepickerSelectOption, DatepickerUnit } from './datepicker';

describe('DatepickerService', () => {
	let service: DatepickerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatepickerService);
	});

	describe('dayOff()', () => {
		const now = new Date();
		const min = new Date(new Date().setDate( new Date().getDate() - 1 ));
		const max = new Date(new Date().setDate( new Date().getDate() + 1 ));

		it('date in range', () => {
			expect(service.dayOff( now, min , max )).toBeFalse();
			expect(service.dayOff( now, min , null )).toBeFalse();
			expect(service.dayOff( now, null , max )).toBeFalse();
		});

		it('date without range', () => {
			expect(service.dayOff( now, null , null )).toBeFalse();
		});

		it('date out of range', () => {
			expect(service.dayOff( now, max , null )).toBeTrue();
			expect(service.dayOff( now, null , min )).toBeTrue();
		});

		it('date min or date max is null', () => {
			expect(service.dayOff( new Date(), null , null )).toBeFalse();
			expect(service.dayOff( new Date(), min , max )).withContext('new Date(), min , max').toBeFalse();
			expect(service.dayOff( new Date(), null , max )).withContext('new Date(), null , max').toBeFalse();
			expect(service.dayOff( new Date(), min , null )).withContext('new Date(), min , null').toBeFalse();
			expect(service.dayOff( new Date(), max , null )).withContext('new Date(), max , null').toBeTrue();
			expect(service.dayOff( new Date(), null , min )).withContext('new Date(), null , min').toBeTrue();
		});

	});


	describe('update()', () => {
		const select = '2020-02-02';
		const view = '2020-02-01';
		let firstWeekDate: Date;
		let datepicker: DatepickerUnit[];


		beforeEach(() => {
			datepicker = service.update([select], new Date(view));

			firstWeekDate = new Date(view);

			firstWeekDate.setDate(0);
			firstWeekDate.setDate( firstWeekDate.getDate() - firstWeekDate.getDay() );

		});


		it('datepicker has 42 ( 7 x 6 ) days', () => {
			expect(datepicker.length).toEqual(42);
		});


		it('select date check', () => {

			const date = datepicker.find( item => item.date === select && item.sdate );

			// the first date of this month
			const day = new Date(view).getDay();

			expect(datepicker.filter( item => item.date === select && item.sdate ).length).toEqual(1);
			expect(date?.y).toEqual(new Date(select).getFullYear());
			expect(date?.m).toEqual(new Date(select).getMonth() + 1);
			expect(date?.d).toEqual(new Date(select).getDate());
			expect(date?.off).toBeFalse();
			expect(date?.out).toBeFalse();
		});


		it('days of previous month check', () => {
			// the first day of this month (saturday)
			const day = new Date(view).getDay();
			// find dates from previous month
			// previous month filled dates check
			expect(datepicker.filter( item => item.out && item.m === new Date(view).getMonth() ).length).toEqual(day);
		});


		it('days of next month check', () => {
			// the first day of next month (sunday)
			// const day = new Date(new Date(view).setMonth( new Date(view).getMonth() + 1)).getDay();
			// find dates from next month
			// next month filled dates check
			expect(datepicker.filter( item => item.out && item.m === new Date(view).getMonth() + 1 ).length).toEqual(0);
		});


		it('select date array is empty', () => {
			const empty = service.update([], new Date(view));
			expect(empty.length).toEqual(42);
			expect(empty.every( ( item, i ) => {
				const date = new Date( firstWeekDate.getTime() );
				date.setDate( firstWeekDate.getDate() + i );
				return new Date(item.date).getTime() === date.getTime();
			}));
		});


		it('select date is null', () => {
			const empty = service.update([], new Date(view));
			expect(datepicker.length).toEqual(42);
		});

	});

	describe('yearRange()', () => {
		const select = '2020-02-02';
		let years: DatepickerSelectOption[];


		it('year list check', () => {
			years = service.yearRange();
			// list contain past 10 years and next 10 years from now
			expect(years.length).toEqual(DATEPICKER_YEAR_RANGE);
			// check year list form start to end
			expect(years.every( ( year, i ) => {
				// first item should be 10 years ago
				return year.val === new Date().getFullYear() + i;
			})).toBeTrue();
		});


		it('limited year range with min value', () => {
			years = service.yearRange(new Date());
			// list contain next 10 years
			expect(years.length).toEqual(DATEPICKER_YEAR_RANGE);
			// check year list form start to end
			expect(years.every( ( year, i ) => {
				// first item should be this year
				return year.val === new Date().getFullYear() + i;
			})).toBeTrue();
		});


		it('limited year range with max value', () => {
			years = service.yearRange(null, new Date());
			// list contain past 10 years and self
			expect(years.length).toEqual(DATEPICKER_YEAR_RANGE);
			// check year list form start to end
			expect(years.every( ( year, i ) => {
				// first item should be this year
				return year.val === new Date().getFullYear() + i;
			})).toBeTrue();
		});
	});


	describe('monthRange()', () => {
		it('month list check', () => {
			const month = service.monthRange();
			expect(month.every( ( m, i ) => {
				return m.val === i && m.title === ( i + 1 ).toString();
			})).toBeTrue();
		});
	});


});
