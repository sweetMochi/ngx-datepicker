import { formatDate } from '@angular/common';


/**
 *Date formate: 2020-02-02
 */
export const DATE_FORMATE = 'yyyy-MM-dd';


/**
 * Display date: 02-02
 */
export const DATE_M_D_FORMATE = 'MM-dd';


/**
 * Display datetime: 2020-02-02 01:01
 */
export const DATE_TIME_FORMATE = 'yyyy-MM-dd HH:mm:ss';


/**
 * Locale format
 * [Link](https://angular.io/api/common/formatDate)
 */
export const DATE_LOCALE = 'en-US';


/**
 * Format type
 *
 * 	'date': 2020-02-02
 * 	'time': 2020-02-02 12:12:12
 * 	'm-d': 02-02
 */
export type DateFormate = 'date' | 'time' | 'm-d';


/**
 * Today is => 2020-02-02
 */
export const DATE_TODAY = formatDate(new Date(), DATE_FORMATE, DATE_LOCALE );


/**
 * Mobile device width
 */
 export const MOBILE_WIDTH = 1000;
