import React, {useEffect, useRef} from "react";

export interface SelectInputProps {
	name: string;
	placeholder: string;
	autoFocus?: boolean;
	disabled?: any;
	options: { [key: string]: string }
	values: any;
	errors?: any;
	unselected?: string;
	onChange: (name: string, value: string) => any;
}


export const SelectInput = (props: SelectInputProps) => {
	const {name, errors, placeholder, options, disabled, autoFocus, values, onChange, unselected} = props;
	const input = useRef<HTMLSelectElement>();
	useEffect(() => {
		if (autoFocus)
			input.current.focus()
	}, []);
	const hasValue = !(!values[name] && values[name] !== 0);
	const hasError = (errors && errors[name]);
	const isDisabled = (typeof disabled == 'boolean' && disabled) || (disabled && disabled[name]);
	return <div className="select-input-wrapper">
		<div className={`select-input ${isDisabled ? 'disabled' : ''} ${hasError ? 'has-error' : ''} ${hasValue ? 'has-value' : ''}`}>
			<label>{placeholder}</label>
			<select
				ref={input}
				name={name}
				value={values[name]}
				onChange={e => onChange(name, e.target.value)}
			>
				{unselected ? <option value="">{unselected}</option> : <option value="">انتخاب نشده</option>}
				{options && Object.keys(options).map(key => <option key={key} value={key}>{options[key]}</option>)}
			</select>
			<div className="border"/>
			<i className="icon">keyboard_arrow_down</i>
		</div>
		{hasError && <div className="select-input-error">{errors[name]}</div>}
	</div>
};
