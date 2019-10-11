import React from "react";

export interface ToggleInputProps {
	name: string;
	placeholder: string;
	values: any;
	disabled?: any;
	errors?: any;
	onChange: (name: string, value: boolean) => any;
}

export const ToggleInput = (props: ToggleInputProps) => {
	const {name, placeholder, errors, values, disabled, onChange} = props;
	const hasError = (errors && errors[name]);
	const isDisabled = (typeof disabled == 'boolean' && disabled) || (disabled && disabled[name]);
	return <div className="form-control-wrapper">
		<label className={`toggle-input ${isDisabled ? 'disabled' : ''}`}>
			<input
				name={name}
				type="checkbox"
				checked={values[name]}
				onChange={e => onChange(name, e.target.checked)}
			/>
			<div className="toggle-switch">
				<div className="thumb">
					<i className="icon check">check</i>
					<i className="icon close">close</i>
				</div>
			</div>
			<div className="content">{placeholder}</div>
		</label>
		{hasError && <div className="form-control-error">{errors[name]}</div>}
	</div>
};
