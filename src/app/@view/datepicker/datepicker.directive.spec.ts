import { DatepickerDirective } from './datepicker.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { DatepickerBoot } from './datepicker';

@Component({
	template: `
		<form>
			<input type="date" name="testNative" [(ngModel)]="testNative">
			<input type="date" name="test" [(ngModel)]="test" appDatepicker>
			<input type="date" name="test1" [(ngModel)]="test1" appDatepicker appDatepickerMin="AAA" appDatepickerMax="BBB">
			<input type="date" name="test2" [(ngModel)]="test2" appDatepicker [appDatepickerMin]="test2Min" [appDatepickerMax]="test2Max">
			<input type="text" name="test3" [(ngModel)]="test3" appDatepicker>
			<input type="date" name="test4" [(ngModel)]="test4" appDatepicker (action)="testAction($event)">
			<input type="date" name="test5" [(ngModel)]="test5" appDatepicker (action)="testAction($event)">
		</form>
	`
})
class TestComponent {
	testNative = '2020-02-02';
	test = '2020-02-02';
	test1 = '2020-01-01';
	test2 = '2020-06-06';
	test2Min = '2020-10-10';
	test2Max = '2020-01-01';
	test3 = '2020-02-02';
	test4 = '2020-02-02';
	test5 = '2020-02-02';
	testAction( date: string ): string {
		return date;
	}
}

describe('DatepickerDirective', () => {
	let component: TestComponent;
	let directive: DatepickerDirective;
	let fixture: ComponentFixture<TestComponent>;
	let debug: DebugElement[];
	let input: HTMLInputElement;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [ FormsModule ],
			declarations: [
				DatepickerDirective,
				TestComponent
			]
		})
		.createComponent(TestComponent);
		fixture.detectChanges();
		component = fixture.componentInstance;
		debug = fixture.debugElement.queryAll(By.directive(DatepickerDirective));
	});


	it('can inject `DatepickerDirective` in input', () => {
		directive = debug[0].injector.get(DatepickerDirective);
		expect(directive).toBeTruthy();
	});


	it('add readonly attribute to prevent native datepicker showen in mobile', () => {
		input = debug[0].nativeElement;
		expect(input.getAttribute('readonly')).toEqual('');
	});


	it('initDate function test', () => {
		const date = '2020-06-06';
		directive = debug[0].injector.get(DatepickerDirective);
		expect(directive.initDate('ASDDSFER')).toBeNull();
		expect(directive.initDate('20200202')).toBeNull();
		expect(directive.initDate(date)).toEqual(date);
	});


	it('callback function should return pick date', () => {
		const date = '2020-06-06';
		directive = debug[4].injector.get(DatepickerDirective);
		spyOn(directive.action, 'emit');
		spyOn(component, 'testAction');
		expect(directive.action.emit).toHaveBeenCalledWith(date);
	});


	it('callback function output', () => {
		const date = '2020-06-06';
		directive = debug[5].injector.get(DatepickerDirective);
		spyOn(component, 'testAction');
		directive.action.emit(date);
		expect(component.testAction).toHaveBeenCalledWith(date);
	});


	it('there is no readonly attribute which is not binding datepicker directive', async(() => {
		const target = fixture.debugElement.query(By.css('[name="testNative"]'));
		input = target.nativeElement as HTMLInputElement;
		expect(input.getAttribute('readonly')).toBeNull();
	}));


	describe('focus on input', () => {
		let initSpy: jasmine.Spy;

		it('should trigger datepicker init', async(() => {
			directive = debug[0].injector.get(DatepickerDirective);
			// 偵測初始化事件
			// @ts-ignore
			initSpy = spyOn(directive.datepicker.init, 'next').and.callThrough();
			input = debug[0].nativeElement as HTMLInputElement;

			// 觸發事件
			input.dispatchEvent(new Event('focus'));
			// 等待 ngModel 生成
			fixture.whenStable().then(() => {
				expect(initSpy).toHaveBeenCalledWith(new DatepickerBoot(
					input.name,
					input,
					// @ts-ignore
					directive.ngModel,
					directive.min,
					directive.max,
					directive.action
				));
			});
		}));


		it('invalid max & min date should not pass max & min value to datepicker', async(() => {
			input = debug[1].nativeElement as HTMLInputElement;
			directive = debug[1].injector.get(DatepickerDirective);
			// 偵測初始化事件
			// @ts-ignore
			initSpy = spyOn(directive.datepicker.init, 'next').and.callThrough();
			// 觸發事件
			input.dispatchEvent(new Event('focus'));
			// 等待 ngModel 生成
			fixture.whenStable().then(() => {
				expect(directive.min).toBeNull();
				expect(directive.max).toBeNull();
				expect(initSpy).toHaveBeenCalledWith(new DatepickerBoot(
					input.name,
					input,
					// @ts-ignore
					directive.ngModel,
					directive.min,
					directive.max,
					directive.action
				));
			});
		}));


		it('invalid input type should not init datepicker', async(() => {
			input = debug[3].nativeElement as HTMLInputElement;
			directive = debug[3].injector.get(DatepickerDirective);
			// 偵測初始化事件
			// @ts-ignore
			initSpy = spyOn(directive.datepicker.init, 'next').and.callThrough();
			// 觸發事件
			input.dispatchEvent(new Event('focus'));
			// 等待 ngModel 生成
			fixture.whenStable().then(() => {
				expect(initSpy).not.toHaveBeenCalled();
			});
		}));


		it('invalid date range should not init datepicker', async(() => {
			input = debug[2].nativeElement as HTMLInputElement;
			directive = debug[2].injector.get(DatepickerDirective);
			// 偵測初始化事件
			// @ts-ignore
			initSpy = spyOn(directive.datepicker.init, 'next').and.callThrough();
			// 觸發事件
			input.dispatchEvent(new Event('focus'));
			// 等待 ngModel 生成
			fixture.whenStable().then(() => {
				expect(directive.min).toEqual(component.test2Min);
				expect(directive.max).toEqual(component.test2Max);
				expect(initSpy).not.toHaveBeenCalled();
			});
		}));
	});

});
