import React, {useEffect, useRef} from "react";
import {convertNumbers} from "components/convertNumbers";

export interface TextInputProps {
	name: string;
	placeholder: string;
	autoFocus?: boolean;
	errors?: any;
	disabled?: any;
	values: any;
	maxLength?: number;
	number?: boolean;
	password?: boolean;
	onChange: (name: string, value: string) => any;
	postfix?: string;
}

function onlyNumbers(str: string) {
	let out = '';
	for(let c of str){
		if(/^[0-9]+$/.test(c)){
			out += c;
		}
	}
	return out;
}
export const TextInput = (props: TextInputProps) => {
	const {name, placeholder, disabled, errors, maxLength, autoFocus, password, values, onChange, number, postfix} = props;
	const input = useRef<HTMLInputElement>();
	useEffect(() => {
		if (autoFocus)
			input.current.focus()
	}, []);
	const hasValue = !(!values[name] && values[name] !== 0);
	const hasError = (errors && errors[name]);
	const isDisabled = (typeof disabled == 'boolean' && disabled) || (disabled && disabled[name]);
	return <div className="text-input-wrapper">
		<div className={`text-input ${isDisabled ? 'is-disabled' : ''} ${hasError ? 'has-error' : ''} ${hasValue ? 'has-value' : ''}`}>
			<label>{placeholder}</label>
			{postfix && <div className="postfix">{postfix}</div>}
			<input
				ref={input}
				name={name}
				type={password ? 'password' : ''}
				dir={number ? 'ltr': 'rtl'}
				style={{textAlign: number ? 'end' : 'start'}}
				placeholder={placeholder}
				value={values[name]}
				maxLength={maxLength}
				pattern={number ? '\\d*' : undefined}
				onFocus={e => e.target.select()}
				onChange={e => onChange(name, number ? onlyNumbers(convertNumbers(e.target.value)) : convertNumbers(e.target.value))}
			/>
			{hasError && <div className="error"/>}
			<div className="border"/>
		</div>
		{hasError && <div className="text-input-error">{errors[name]}</div>}
	</div>
};
