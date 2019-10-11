import React, {useEffect, useRef} from "react";

export interface TextInputProps {
	name: string;
	placeholder: string;
	autoFocus?: boolean;
	values: any;
	errors?: any;
	onChange: (name: string, value: string) => any;
}

export const PasswordInput = (props: TextInputProps) => {
	const {name, placeholder, autoFocus, values, errors, onChange} = props;
	const input = useRef<HTMLInputElement>();
	useEffect(() => {
		if (autoFocus)
			input.current.focus()
	}, []);
	const hasValue = !(!values[name] && values[name] !== 0);
	const hasError = (errors && errors[name]);
	return <div className="form-control-wrapper">
		<div className={`form-control ${hasError ? 'has-error' : ''} ${hasValue ? 'has-value' : ''}`}>
			<label>{placeholder}</label>
			<input
				ref={input}
				name={name}
				type="password"
				placeholder={placeholder}
				value={values[name]}
				onFocus={e => e.target.select()}
				onChange={e => onChange(name, e.target.value)}
			/>
			{hasError && <div className="error"/>}
			<div className="border"/>
		</div>
		{hasError && <div className="form-control-error">{errors[name]}</div>}
	</div>
};
