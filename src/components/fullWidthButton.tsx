import React, {ReactNode} from 'react';


export function FullWidthButton(props: { children: ReactNode, className?: string, disabled?: boolean, success?: boolean, onClick?: () => any }) {
	return <button onClick={props.onClick} className={`full-width-button ${props.success ? 'success' : ''} ${props.className || ''} ${props.disabled ? 'disabled' : ''} flex-0`}>
		{props.children}
	</button>
}
