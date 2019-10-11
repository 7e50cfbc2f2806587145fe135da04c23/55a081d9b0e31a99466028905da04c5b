import React from "react";

export interface FlatSelectInputProps {
	name: string;
	options?: { [key: string]: string }
	disabled?: any;
	values: any;
	errors?: any;
	onChange: (name: string, value: string) => any;
}


export const FlatSelectInput = (props: FlatSelectInputProps) => {
	const {name, errors, options, disabled, values, onChange} = props;
	const hasValue = !(!values[name] && values[name] !== 0);
	const hasError = (errors && errors[name]);
	const isDisabled = (typeof disabled == 'boolean' && disabled) || (disabled && disabled[name]);
	return <div className="form-control-wrapper">
		<div className={`flat-select ${isDisabled ? 'disabled' : ''} ${hasError ? 'has-error' : ''} ${hasValue ? 'has-value' : ''}`}>
			{options && Object.keys(options).map(key => <div
				key={key}
				onClick={() => onChange(name, key)}
				className={`option ${key == values[name] ? 'selected' : ''}`}>
				{options[key]}
			</div>)}
		</div>
		{hasError && <div className="form-control-error">{errors[name]}</div>}
	</div>
};
