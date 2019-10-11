import React, {useEffect, useRef} from "react";
import {convertNumbers} from "components/convertNumbers";

export interface AreaInputProps {
	name: string;
	placeholder: string;
	values: any;
	errors?: any;
	maxLength?: number;
	rows?: number;
	autoFocus?: boolean;
	onChange: (name: string, value: string) => any;
}

export const AreaInput = (props: AreaInputProps) => {
	const {name, placeholder, errors, autoFocus, maxLength, values, onChange, rows = 4} = props;
	const input = useRef<HTMLTextAreaElement>();
	useEffect(() => {
		if (autoFocus)
			input.current.focus()
	}, []);

	const hasError = (errors && errors[name]);
	const hasValue = !(!values[name] && values[name] !== 0);
	return <div className="form-control-wrapper">
		<div className={`form-control ${hasError ? 'has-error' : ''} ${hasValue ? 'has-value' : ''}`}>
			<label>{placeholder}</label>
			<textarea
				ref={input}
				name={name}
				placeholder={placeholder}
				value={values[name]}
				maxLength={maxLength}
				rows={rows}
				onChange={e => onChange(name, convertNumbers(e.target.value))}
			/>
			{hasError && <div className="error"/>}
			<div className="border"/>
		</div>
		{hasError && <div className="form-control-error">{errors[name]}</div>}
	</div>
};
