import React, {useEffect, useRef} from "react";
import {convertNumbers} from "components/convertNumbers";

export interface NumberInputProps {
	name: string;
	placeholder: string;
	postfix?: string;
	errors?: any;
	values: any;
	maxLength?: number;
	money?: boolean;
	disabled?: any;
	autoFocus?: boolean;
	onChange: (name: string, value: number) => any;
}

function round(num: number, d: number) {
	const a = Math.pow(10, d);
	return Math.round(num * a) / a;
}

function replaceAll(target: string, search: string, replacement: string) {
	return target.replace(new RegExp(search, 'g'), replacement);
}

export function makeMoney(v: any) {
	let value = v;
	if (typeof value === 'undefined' || value === null) {
		return '';
	}
	const fx = 2;
	value = parseFloat(value.toString());
	const sign = Math.sign(value);
	value = sign * value;

	const price = round(value, fx);
	const nm = price.toString();
	let op = '';
	let s = 0;
	const m = nm.length - 1;
	const deci = '.';
	const thz = ',';
	for (let i = m; i > -1; i -= 1) {
		s += 1;
		const l = m - i;
		const c = nm.charAt(i);
		if (c === '.') {
			s = 0;
			op = deci + op;
		} else {
			op = nm[i] + op;
			if (s >= 3 && i !== 0 && l >= fx) {
				op = thz + op;
				s = 0;
			}
		}
	}
	return op;
}

export const NumberInput = (props: NumberInputProps) => {
	const {name, placeholder, errors, postfix, maxLength, disabled, values, money, autoFocus, onChange} = props;
	const input = useRef<HTMLInputElement>();
	useEffect(() => {
		if (autoFocus)
			input.current.focus()
	}, []);
	const val = !!values[name] ? values[name].toString() : '0';
	const hasValue = !!values[name];
	const hasError = (errors && errors[name]);
	const isDisabled = (typeof disabled == 'boolean' && disabled) || (disabled && disabled[name]);
	return <div className="number-input-wrapper">
		<div className={`number-input ${isDisabled ? 'is-disabled' : ''} ${hasError ? 'has-error' : ''} ${hasValue ? 'has-value' : ''}`}>
			<label>{placeholder}</label>
			{postfix && <div className="postfix">{postfix}</div>}
			<input
				name={name}
				ref={input}
				type="text"
				dir="ltr"
				style={{textAlign:'end'}}
				value={money ? makeMoney(val) : val}
				maxLength={maxLength}
				pattern={'\\d*'}
				onFocus={e => e.target.select()}
				onChange={e => {
					let x = convertNumbers(replaceAll(e.target.value, ',', ''));
					if (x.length == 2 && x.charAt(1) == "0" && e.target.selectionStart < 2) {
						x = "0" + x.charAt(0);
					}
					onChange(name, parseInt(x || '0'))
				}}
			/>
			<div className="border"/>
		</div>
		{hasError && <div className="number-input-error">{errors[name]}</div>}
	</div>
};
