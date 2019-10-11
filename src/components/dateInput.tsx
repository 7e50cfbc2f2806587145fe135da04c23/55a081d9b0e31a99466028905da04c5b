import React, {Fragment, useRef, useState} from 'react';
import {Portal} from "portalo";
import {Outbind} from "outbind";

export interface DateInputProps {
	name: string;
	placeholder: string;
	values: any;
	errors?: any;

	workDay?: WeekDay;
	holidays?: WeekDay;
	calendarType?: CalendarType;
	direction?: CalendarDirection;

	onChange: (name: string, value: any) => any;
}

export const DateInput = (props: DateInputProps) => {
	const {name, placeholder, errors, values, onChange} = props;

	const {
		calendarType = CalendarType.persian,
		workDay = WeekDay.saturday,
		holidays = WeekDay.friday,
		direction = 'both'
	} = props;
	const hasError = (errors && errors[name]);
	const [visible, setVisible] = useState(false);
	let val = values[name];
	if (val) {
		const p = toPersian(new Date(val));
		val = `${p[2]} ${monthNames[calendarType][p[1] - 1]} ${p[0]}`
	}

	function close() {
		setVisible(false)
	}

	return <div className="form-control-wrapper">
		<Portal selector={() => document.getElementById('app')}>
			{visible && <div className="dialog" onClick={close}>
                <div className="box container-slim pt-1" onClick={e => e.stopPropagation()}>
                    <header>
                        <div>انتخاب تاریخ</div>
                        <div className="icon mr-auto" onClick={close}>close</div>
                    </header>
                    <div className="py-2">
                        <CalendarView
                            workDay={workDay}
                            holidays={holidays}
                            calendarType={calendarType}
                            direction={direction}
                            value={values[name]}
                            onChange={value => {
								onChange(name, value);
								close()
							}}
                        />
                    </div>
                </div>
            </div>}
		</Portal>
		<button className={`date-input ${hasError ? 'error' : ''}`} onClick={() => setVisible(true)}>
			{!val ? <label>{placeholder}</label> : <div className="content">{val}</div>}
			<div className="border"/>
			<i className="icon">event</i>
		</button>
		{hasError && <div className="form-control-error">{errors[name]}</div>}
	</div>
};


export type CalendarViewProps = {
	workDay?: WeekDay;
	holidays?: WeekDay;
	calendarType?: CalendarType;
	direction?: CalendarDirection;
	value: any;
	onChange: (value: any) => any;
	ranged?: boolean;
};

export type CalendarDirection = 'forward' | 'backward' | 'both';

export const CalendarView = (props: CalendarViewProps) => {

	const holder = useRef({selector: 0}).current;

	const {ranged} = props;
	const {
		calendarType = CalendarType.persian,
		workDay = WeekDay.saturday,
		holidays = WeekDay.friday,
		direction = 'both',
		value,
		onChange,
	} = props;

	const today: DateTuple = getCurrent(new Date(), calendarType);


	const context: DateTuple[] = ranged ? value.map(
		(a: string) => a ? getCurrent(new Date(a), calendarType) : null,
	) : [value ? getCurrent(new Date(value as any), calendarType) : null];

	const [state, setState] = useState(context[0] || today);

	function setContext(selector: any, arr: DateTuple, newVal?: string[]) {
		switch (calendarType) {
			case CalendarType.persian: {
				const date = toGregorian(arr[0], arr[1], arr[2]);
				date.setUTCHours(24, 0, 0, 0);
				const newValue = Array.from(newVal || value);
				newValue[selector] = date.toISOString();
				return onChange(ranged ? newValue : newValue[0]);
			}
			case CalendarType.gregorian: {
				const date = new Date(arr[0], arr[1] - 1, arr[2]);
				date.setUTCHours(24, 0, 0, 0);
				const newValue = Array.from(newVal || value);
				newValue[selector] = date.toISOString();
				return onChange(ranged ? newValue : newValue[0]);
			}
		}
	}

	const dayClicked = (date: DateTuple) => {

		if (ranged) {
			if (holder.selector === 0) {
				const newVal = Array.from(value) as string[];
				delete newVal[1];
				setContext(0, date, newVal);
				holder.selector = 1;
			} else if (holder.selector === 1 && context[0]) {
				if (compareDateLessThan(date, context[0])) {
					const newVal = Array.from(value) as string[];
					newVal[1] = newVal[0];
					setContext(0, date, newVal);
					holder.selector = 0;
				} else if (compareDateGreaterThan(date, context[0])) {
					setContext(1, date);
					holder.selector = 0;
				}
			}
		} else {
			holder.selector = 0;
			setContext(0, date, [value]);
		}
	};

	return <div className="calendar-range-wrapper">
		<Days
			context={context}
			state={state}
			setState={setState}
			today={today}
			onClick={dayClicked}
			workDay={workDay}
			calendarType={calendarType}
			holidays={holidays}
			direction={direction}
		/>
	</div>;
};

export const Years = (props: {
	y: number;
	today: number;
	direction: CalendarDirection;
	onClick: (y: number) => any;
}) => {
	const h = 7;
	const v = 5;

	const {y, onClick, direction, today} = props;

	return <div className="calendar-grid years">
		{range(v).map((j) => {
			return <div key={j} className="calendar-row">
				{range(h).map((i) => {
					const id = (j * h + i);
					const index = id + y - Math.floor(h * v / 2);

					let dis = false;
					if ((direction === 'forward' && index < today) ||
						(direction === 'backward' && index > today)) {
						dis = true;
					}

					return <CalendarItem key={index} onClick={() => onClick(index)} isToday={y == index}
										 isDisabled={dis}>{index}</CalendarItem>
				})}
			</div>;
		})}
	</div>;
};

type CalendarItemProps = {
	children?: React.ReactNode;
	today?: DateTuple;
	date?: DateTuple;
	context?: DateTuple[];
	holidays?: boolean;
	isToday?: boolean;
	isDisabled?: boolean;
	hidden?: boolean;
	inactive?: boolean;
	onClick?: (date?: DateTuple) => any;
	direction?: CalendarDirection;
};
const CalendarItem = (props: CalendarItemProps) => {
	const {
		children,
		holidays,
		inactive,
		isToday,
		isDisabled,
		today,
		date,
		onClick,
		context,
		hidden,
		direction,
	} = props;
	const classes: any = {
		'calendar-item': true,
	};
	if (holidays) {
		classes['holiday'] = true;
	}
	if (isToday || (date && today) && compareDateEquality(today, date)) {
		classes['today'] = true;
	}
	if (inactive) {
		classes['inactive'] = true;
	}
	let isStarting = false;
	let isLink = false;
	let isEnding = false;
	if (context && Array.isArray(context) && context.length > 0) {
		isStarting = compareDateEquality(date, context[0]);
		isEnding = compareDateEquality(date, context[1]);
		isLink = compareDateBetween(context[0], date, context[1]);
	}
	const isHighlight = isStarting || isLink || isEnding;
	if (isHighlight) {
		classes['highlight'] = true;
	}
	if (isStarting && context[1]) {
		classes['highlight-starting'] = true;
	}
	if (isEnding && context[0]) {
		classes['highlight-ending'] = true;
	}
	if (isLink) {
		classes['highlight-link'] = true;
	}
	if (hidden) {
		classes['hidden'] = true;
	}
	if (isDisabled ||
		(direction === 'forward' && compareDateLessThan(date, today)) ||
		(direction === 'backward' && compareDateGreaterThan(date, today))
	) {
		classes['disabled'] = true;
	}
	return <div
		className={Object.keys(classes).filter(a => classes[a]).join(' ')}
		onClick={() => onClick(date)}
	>{children || date[2]}</div>;
};
const Days = (props: {
	context: DateTuple[];
	state: DateTuple;
	today: DateTuple;
	setState: (date: DateTuple) => any;
	onClick: (date: DateTuple) => any;
	workDay: WeekDay;
	calendarType: CalendarType;
	holidays: WeekDay;
	direction?: CalendarDirection;
}) => {

	const {
		state, context, setState,
		today, calendarType,
		workDay, onClick,
		holidays,
		direction,
	} = props;

	const previousYear = state[1] - 1 < 1 ? state[0] - 1 : state[0];
	const previousMonth = state[1] - 1 < 1 ? 12 : state[1] - 1;

	const nextYear = state[1] + 1 > 12 ? state[0] + 1 : state[0];
	const nextMonth = state[1] + 1 > 12 ? 1 : state[1] + 1;

	const start = startOfMonth(state, calendarType);
	const length = monthLength(calendarType, state);

	const pState: DateTuple = [previousYear, previousMonth, 1];
	const previousLength = monthLength(calendarType, pState);
	const previousStart = startOfMonth(pState, calendarType);

	// const overflow = cycle(7 - workDay, start) + length > 35;
	const previousOverflow = cycle(7 - workDay, previousStart) + previousLength > 35;


	const [selectYear, setSelectYear] = useState(false);

	const h = 7;
	const v = 5;

	function goPreviousYear() {
		setState([state[0] - (h * v - 2), state[1], state[2]]);
	}

	function goNextYear() {
		setState([state[0] + (h * v - 2), state[1], state[2]]);

	}

	return <Fragment>
		<div className="calendar-row title">
			<div className="action previous-month" onClick={() =>
				selectYear ? goPreviousYear() : setState(subOneMonth(state))
			}>
				<i className="icon">arrow_forward</i>
			</div>

			<div className="action" onClick={() => {
				setState(today);
			}}>
				امروز
			</div>
			<div className="marginal"/>
			<div className="content">
				<div className="month-indicator">{monthNames[calendarType][state[1] - 1]}</div>
				<div className="year-indicator">{state[0]}</div>
			</div>

			<div className="action" onClick={() => {
				setSelectYear(!selectYear);
			}}>
				سال
			</div>

			<div className="action next-month" onClick={() =>
				selectYear ? goNextYear() : setState(addOneMonth(state))
			}>
				<i className="icon">arrow_back</i>
			</div>
		</div>

		{selectYear ?
			<Years y={state[0]} today={today[0]} direction={direction} onClick={y => {
				setState([y, state[1], state[2]]);
				setSelectYear(false);
			}}/>
			:
			<div className="calendar-grid">
				<div className="calendar-row header">
					{range(7).map((i) => {
						const c = cycle(workDay, i);
						return <div
							key={i}
							className={`calendar-item ${c === holidays ? 'holiday' : ''}`}
						>
							{dayNames[calendarType][c]}
						</div>;
					})}
				</div>
				{range(5).map((j) => {
					return <div className="calendar-row" key={j}>{
						range(7).map((i) => {
							const id = j * 7 + i;
							const current = id + 1 - cycle(7 - workDay, start);
							const c = cycle(workDay, i);
							if (current < 1) {
								const previousCurrent = id + 1 - cycle(7 - workDay, previousStart);

								const key = previousCurrent + 35;
								if (previousOverflow && key <= previousLength) {
									return <CalendarItem
										key={i}
										holidays={c === holidays}
										date={[pState[0], pState[1], key]}
										context={context}
										today={today}
										onClick={onClick}
										direction={direction}
										inactive
									/>;
								}
								return <CalendarItem
									key={i}
									holidays={c === holidays}
									date={[previousYear, previousMonth, previousLength + current]}
									context={context}
									today={today}
									direction={direction}
									hidden
								/>;
							}
							if (current > length) {
								return <CalendarItem
									key={i}
									holidays={c === holidays}
									date={[nextYear, nextMonth, current - length]}
									context={context}
									today={today}
									onClick={onClick}
									direction={direction}
									inactive
									hidden
								/>;
							}
							return <CalendarItem
								key={i}
								holidays={c === holidays}
								date={[state[0], state[1], current]}
								context={context}
								today={today}
								onClick={onClick}
								direction={direction}
							/>;
						})
					}</div>;
				})}
			</div>}
	</Fragment>;
};


type DateTuple = [number, number, number];

export enum CalendarType {persian = 0, gregorian = 1}

enum WeekDay {
	sunday = 0,
	monday = 1,
	tuesday = 2,
	wednesday = 3,
	thursday = 4,
	friday = 5,
	saturday = 6,
}

const range = (size: number) => Array.from(Array(size).keys());


function getCurrent(date: Date, type: CalendarType): DateTuple {
	if (type === CalendarType.gregorian) {
		const gy = date.getUTCFullYear();
		const gm = date.getUTCMonth() + 1;
		const gd = date.getUTCDate();
		return [gy, gm, gd];
	}
	if (type === CalendarType.persian) {
		return toPersian(date);
	}
	return [0, 0, 0];
}

function getMonday(d: Date) {
	const date = new Date(d);
	const day = date.getDay() || 7;
	if (day !== 1) {
		date.setHours(-24 * (day - 1));
	}
	return date;
}

function compareDateEquality(lhs: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return x1 === x2;
}

function compareDateGreaterThan(lhs: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return x1 > x2;
}

function compareDateGreaterThanEqual(lhs: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return x1 >= x2;
}

function compareDateLessThan(lhs: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return x1 < x2;
}

function compareDateLessThanEqual(lhs: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return x1 <= x2;
}

function compareDateBetween(lhs: DateTuple, value: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs || !value) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const v1 = value[0] * 366 + value[1] * 31 + value[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return v1 > x1 && v1 < x2;
}

function compareDateBetweenEqual(lhs: DateTuple, value: DateTuple, rhs: DateTuple) {
	if (!rhs || !lhs || !value) {
		return;
	}
	const x1 = lhs[0] * 366 + lhs[1] * 31 + lhs[2];
	const v1 = value[0] * 366 + value[1] * 31 + value[2];
	const x2 = rhs[0] * 366 + rhs[1] * 31 + rhs[2];
	return v1 >= x1 && v1 <= x2;
}

export function startOfMonth(date: DateTuple, type: CalendarType) {
	if (type === CalendarType.gregorian) {
		const now = new Date(date[0], date[1] - 1, 1);
		return now.getDay();
	}
	if (type === CalendarType.persian) {
		const m = toGregorian(date[0], date[1], 1);
		return m.getDay();
	}
	return 0;
}

export function addOneMonth(state: DateTuple): DateTuple {
	const nextYear = state[1] + 1 > 12 ? state[0] + 1 : state[0];
	const nextMonth = state[1] + 1 > 12 ? 1 : state[1] + 1;
	return [nextYear, nextMonth, state[2]];
}

export function subOneMonth(state: DateTuple): DateTuple {
	const previousYear = state[1] - 1 < 1 ? state[0] - 1 : state[0];
	const previousMonth = state[1] - 1 < 1 ? 12 : state[1] - 1;
	return [previousYear, previousMonth, state[2]];
}

export function cyclePeriod(date: Date, typ: number): [Date, Date] {
	try {
		let [py, pm] = toPersian(date);
		const nm = typ - 1;
		const pd = 1;
		pm = Math.floor((pm - 1) / typ) * typ + 1;
		const pd2 = persianMonthLength(py, pm + nm);
		return [
			toGregorian(py, pm, pd, 0, 0, 0),
			toGregorian(py, pm + nm, pd2, 29, 59, 59),
		];
	} catch (e) {
		return null;
	}
}

export function cycleMonth(date: Date, typ: number) {
	let [py, pm] = toPersian(date);
	pm = Math.floor((pm - 1) / typ) * typ + 1;
	return py * 12 + pm;
}

export function calculatePeriod(base: Date, current: Date, typ: number) {
	try {
		const a = cycleMonth(base, typ);
		const b = cycleMonth(current, typ);
		return (b - a) / typ;
	} catch (e) {
		return 0;
	}
}

export function cycle(workDay: number, i: number) {
	return (workDay + i) % 7;
}

export function monthLength(type: CalendarType, date: DateTuple) {
	if (type === CalendarType.gregorian) {
		return gregorianMonthLength(date[0], date[1]);
	}
	if (type === CalendarType.persian) {
		return persianMonthLength(date[0], date[1]);
	}
	return 30;
}

export const monthNames = {
	[CalendarType.persian]: [
		'فروردین',
		'اردیبهشت',
		'خرداد',

		'تیر',
		'مرداد',
		'شهریور',

		'مهر',
		'آبان',
		'آذر',

		'دی',
		'بهمن',
		'اسفند',
	],
	[CalendarType.gregorian]: [
		'January',
		'February',
		'March',

		'April',
		'May',
		'June',

		'July',
		'August',
		'September',

		'October',
		'November',
		'December',
	],
};

const dayNames = {
	[CalendarType.persian]: [
		'یکشنبه',
		'دوشنبه',
		'سه‌شنبه',
		'چهارشنبه',
		'پنجشنبه',
		'جمعه',
		'شنبه',
	],
	[CalendarType.gregorian]: [
		'SUN',
		'MON',
		'TUE',
		'WED',
		'THU',
		'FRI',
		'SAT',
	],
};


function jalCal(jy: number) {
	const breaks = [-61, 9, 38, 199, 426, 686,
		756, 818, 1111, 1181, 1210, 1635, 2060,
		2097, 2192, 2262, 2324, 2394, 2456, 3178,
	];
	const bl = breaks.length;
	const gy = jy + 621;
	let leapJ = -14;
	let jp = breaks[0];
	let jm;
	let jump;
	let leap;
	let leapG;
	let march;
	let n;
	let i;

	if (jy < jp || jy >= breaks[bl - 1]) {
		throw new Error(`Invalid date format.`);
	}

	for (i = 1; i < bl; i += 1) {
		jm = breaks[i];
		jump = jm - jp;
		if (jy < jm) {
			break;
		}
		leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
		jp = jm;
	}
	n = jy - jp;

	leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
	if (mod(jump, 33) === 4 && jump - n === 4) {
		leapJ += 1;
	}

	leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

	march = 20 + leapJ - leapG;

	if (jump - n < 6) {
		n = n - jump + div(jump + 4, 33) * 33;
	}
	leap = mod(mod(n + 1, 33) - 1, 4);
	if (leap === -1) {
		leap = 4;
	}

	return {
		leap,
		gy,
		march,
	};
}

function j2d(jy: number, jm: number, jd: number) {
	const r = jalCal(jy);
	return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number) {
	const gy = d2g(jdn).gy;
	let jy = gy - 621;
	const r = jalCal(jy);
	const jdn1f = g2d(gy, 3, r.march);
	let jd;
	let jm;
	let k;

	k = jdn - jdn1f;
	if (k >= 0) {
		if (k <= 185) {
			jm = 1 + div(k, 31);
			jd = mod(k, 31) + 1;
			return {
				jy
				, jm
				, jd,
			};
		}
		k -= 186;
	} else {
		jy -= 1;
		k += 179;
		if (r.leap === 1) {
			k += 1;
		}
	}
	jm = 7 + div(k, 30);
	jd = mod(k, 30) + 1;
	return {
		jy, jm, jd,
	};
}

function g2d(gy: number, gm: number, gd: number) {
	let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
		+ div(153 * mod(gm + 9, 12) + 2, 5)
		+ gd - 34840408;
	d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
	return d;
}

function d2g(jdn: number) {
	let j;
	let i;
	let gd;
	let gm;
	let gy;
	j = 4 * jdn + 139361631;
	j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
	i = div(mod(j, 1461), 4) * 5 + 308;
	gd = div(mod(i, 153), 5) + 1;
	gm = mod(div(i, 153), 12) + 1;
	gy = div(j, 1461) - 100100 + div(8 - gm, 6);
	return {
		gy, gm, gd,
	};
}

function localToGregorian(jy: number, jm: number, jd: number) {
	return d2g(j2d(jy, jm, jd));
}

function div(a: number, b: number) {
	return ~~(a / b);
}

function mod(a: number, b: number) {
	return a - ~~(a / b) * b;
}

function toPersianLocally(gy: number, gm: number, gd: number) {
	return d2j(g2d(gy, gm, gd));
}

function isValidPersianDate(jy: number, jm: number, jd: number) {
	return jy >= -61 && jy <= 3177 &&
		jm >= 1 && jm <= 12 &&
		jd >= 1 && jd <= this.persianMonthLength(jy, jm);
}

function leapYear(jy: number) {
	return jalCal(jy).leap === 0;
}

function persianMonthLength(jy: number, jm: number) {
	if (jm <= 6) {
		return 31;
	}
	if (jm <= 11) {
		return 30;
	}
	if (leapYear(jy)) {
		return 30;
	}
	return 29;
}

function gregorianMonthLength(gy: number, gm: number) {
	return new Date(gy, gm, 0).getDate();
}

export function toGregorian(jy: number, jm: number, jd: number, y: number = 0, m: number = 0, s: number = 0) {
	const a = localToGregorian(jy, jm, jd);
	return new Date(a.gy, a.gm - 1, a.gd, y, m, s, 0);
}

function fromGregorian(gy: number, gm: number, gd: number): DateTuple {
	const a = toPersianLocally(gy, gm, gd);
	return [a.jy, a.jm, a.jd];
}

export function toPersian(date: Date): DateTuple {
	let a = date;
	if (typeof a === 'number') {
		a = new Date(a);
	}
	const gy = a.getUTCFullYear();
	const gm = a.getUTCMonth() + 1;
	const gd = a.getUTCDate();
	const h = toPersianLocally(gy, gm, gd);
	return [h.jy, h.jm, h.jd];
}
