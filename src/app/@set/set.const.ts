import { formatDate } from '@angular/common';


/**
 * 顯示日期格式 (2020-02-02)
 */
export const DATE_FORMATE = 'yyyy-MM-dd';


/**
 * 顯示日期格式 (02-02)
 */
export const DATE_M_D_FORMATE = 'MM-dd';


/**
 * 顯示日期格式 (2020-02-02 01:01)
 */
export const DATE_TIME_FORMATE = 'yyyy-MM-dd HH:mm:ss';


/**
 * 系統日期地區
 * 請參照 angular formatDate
 */
export const DATE_LOCALE = 'en-US';


/**
 * 格式化類型
 * date: 2020-02-02
 * time: 2020-02-02 12:12:12
 * m-d: 02-02
 */
export type DateFormate = 'date' | 'time' | 'm-d';


/**
 * 今天日期：2020-02-02
 */
export const DATE_TODAY = formatDate(new Date(), DATE_FORMATE, DATE_LOCALE );
