import React, {useEffect, useRef} from "react";
import {convertNumbers} from "components/convertNumbers";

export interface SimpleInputProps {
	name: string;
	placeholder: string;
	autoFocus?: boolean;
	values: any;
	onChange: (name: string, value: string) => any;
}

export const SimpleInput = (props: SimpleInputProps) => {
	const {name, placeholder, autoFocus, values, onChange} = props;
	const input = useRef<HTMLInputElement>();
	useEffect(() => {
		if (autoFocus)
			input.current.focus()
	}, []);
	return <input
		ref={input}
		name={name}
		type="text"
		placeholder={placeholder}
		value={values[name]}
		onFocus={e => e.target.select()}
		onChange={e => onChange(name, convertNumbers(e.target.value))}
	/>
};
