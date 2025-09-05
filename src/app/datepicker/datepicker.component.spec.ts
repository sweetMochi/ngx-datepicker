import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { By } from '@angular/platform-browser';


import { DatepickerBoot } from './datepicker';
import { DatepickerComponent } from './datepicker.component';
import { DATEPICKER_YEAR_RANGE } from './datepicker';
import { DATE_FORMATE, DATE_LOCALE } from '../@set/set.const';

@Component({
	standalone: false,
	template: `
		<form>
			<input type="date" name="date" #input="ngModel" [(ngModel)]="date">
		</form>
	`
})
class TestComponent {
	@ViewChild('input', { static: false }) ngModel!: NgModel;
	date = '';
}


describe('DatepickerComponent', () => {
	let input: HTMLInputElement;
	let test: TestComponent;
	let testFixture: ComponentFixture<TestComponent>;
	let component: DatepickerComponent;
	let fixture: ComponentFixture<DatepickerComponent>;

	beforeEach(waitForAsync(() => {
		// for ngmodel mock test
		testFixture = TestBed.configureTestingModule({
			imports: [ FormsModule ],
			declarations: [ TestComponent ]
		})
		.createComponent(TestComponent);
	}));

	function testFn(): boolean {
		return true;
	}

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerComponent);
		component = fixture.componentInstance;
		test = testFixture.componentInstance;
		fixture.detectChanges();
		testFixture.detectChanges();
		input = testFixture.debugElement.query(By.css('input')).nativeElement;
	});


	it('ngOnInit check', () => {
		expect(component.selectMonth.length).toEqual(12);
		expect(component.selectYear.length).toEqual( DATEPICKER_YEAR_RANGE );
		expect(component.selectYear.every( ( year, i ) => {
			// first item should be year of min date
			return year.val === new Date().getFullYear() + i;
		})).toBeTrue();
	});


	describe('pick one date', () => {

		const sdate = '2020-02-02';

		const pickDate = '2020-05-05';

		beforeEach(() => {
			// mock datepicker init
			component.ngModel = test.ngModel;
			component.show = true;
			component.sdate = sdate;
			component.action = new EventEmitter<string>();
			spyOn(component, 'update');
			spyOn(component.action, 'emit');
			spyOn(component.ngModel.update, 'emit');
		});


		it('formated date: "2020-05-05" ', () => {
			// tirger pick event
			component.pick(pickDate);
			expect(component.sdate).toEqual(pickDate);
			expect(component.update).toHaveBeenCalled();
			expect(component.action.emit).toHaveBeenCalledWith(pickDate);
			expect(component.ngModel!.update.emit).toHaveBeenCalledWith(pickDate);
		});


		it('"null" date', () => {
			// tirger pick event
			component.pick('');
			expect(component.sdate).toEqual(sdate);
			expect(component.update).not.toHaveBeenCalled();
			expect(component.action.emit).not.toHaveBeenCalled();
			expect(component.ngModel!.update.emit).not.toHaveBeenCalled();
			expect(component.show).toBeTrue();
		});


		it('invalidated date: "SDFGDSWETYQ" ', () => {
			// tirger pick event
			component.pick('SDFGDSWETYQ');
			expect(component.sdate).toEqual(sdate);
			expect(component.update).not.toHaveBeenCalled();
			expect(component.action.emit).not.toHaveBeenCalled();
			expect(component.ngModel!.update.emit).not.toHaveBeenCalled();
			expect(component.show).toBeTrue();
		});

	});


	describe('init', () => {
		it('default check', waitForAsync(() => {
			spyOn(component, 'update');

			testFixture.whenStable().then(( () => {
				component.init( new DatepickerBoot(
					input.name,
					input,
					test.ngModel,
					'',
					'',
					new EventEmitter()
				));

				expect(component.sdate).toEqual(formatDate(new Date(), DATE_FORMATE, DATE_LOCALE));
				expect(component.dateMin).withContext('dateMin should be null').toBeNull()
				expect(component.dateMax).withContext('dateMin should be null').toBeNull();
				expect(component.update).toHaveBeenCalled();
				expect(component.show).toBeTrue();
				expect(component.top).not.toBeUndefined();
				expect(component.left).not.toBeUndefined();
				expect(component.seeDate.length).toEqual( 7 * 6 );
				expect(component.selectMonth.length).toEqual(12);
				expect(component.selectYear.length).toEqual( DATEPICKER_YEAR_RANGE);
			}));
		}));

		it('select date & min date & max date', waitForAsync(() => {
			const min = '2020-01-01';
			const max = '2020-10-10';
			test.date = '2020-02-02';
			testFixture.detectChanges();
			testFixture.whenStable().then(( () => {
				component.init( new DatepickerBoot(
					input.name,
					input,
					test.ngModel,
					min,
					max,
					new EventEmitter()
				));
				expect(component.dateMin).toEqual(new Date(min));
				expect(component.dateMax).toEqual(new Date(max));
				// check year list
				console.log(component.selectYear);

				expect(component.selectYear.length).toEqual(5);
				expect(component.selectYear[0].val).toEqual(new Date(min).getFullYear());
			}));
		}));


		it('now date is less than min date', waitForAsync(() => {
			const min = '2020-02-02';
			const date = '2020-01-01';

			testFixture.whenStable().then(( () => {
				// change now date
				component.now = new Date(date);
				component.init( new DatepickerBoot(
					input.name,
					input,
					test.ngModel,
					min,
					'',
					new EventEmitter()
				));
				expect(component.dateMin).toEqual(new Date(min));
				expect(component.date).toEqual(new Date(min));

				// check year list
				expect(component.selectYear.length).toEqual(DATEPICKER_YEAR_RANGE);

			}));
		}));


		it('now date is greater than max date', waitForAsync(() => {
			const max = '2020-02-02';
			const date = '2020-10-10';

			testFixture.whenStable().then(( () => {
				// change now date
				component.now = new Date(date);
				component.init( new DatepickerBoot(
					input.name,
					input,
					test.ngModel,
					'',
					max,
					new EventEmitter()
				));

				expect(component.dateMax).toEqual(new Date(max));
				expect(component.date).toEqual(new Date(max));
				// check year list
				expect(component.selectYear.length).toEqual(DATEPICKER_YEAR_RANGE);

				// check list sequence
				expect(component.selectYear.every( ( year, i ) => {
					// first item should be this year
					return year.val === new Date().getFullYear() + i;
				})).toBeTrue();
			}));
		}));


		it('invalidated min & max date', waitForAsync(() => {

			const min = 'ASDASDWQRG';
			const max = 'TTBSWWD';

			testFixture.whenStable().then(( () => {
				component.init( new DatepickerBoot(
					input.name,
					input,
					test.ngModel,
					min,
					max,
					new EventEmitter()
				));
				expect(component.dateMin).toBeNull('dateMin should be null');
				expect(component.dateMax).toBeNull('dateMin should be null');
			}));
		}));

	})
});
