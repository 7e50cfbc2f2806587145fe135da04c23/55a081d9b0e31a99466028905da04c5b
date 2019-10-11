import React, {ReactNode} from 'react';
import {Portal} from "portalo";


export function Dialog(props: { children?: ReactNode, value: boolean, onChange: (value: boolean) => any, centered?: boolean, className?: string }) {
	function close() {
		props.onChange(false);
	}
	function finder() {
		return document.getElementById('app');
	}
	return <Portal selector={finder}>
		{props.value && <div className={`dialog ${props.centered ? 'dialog-centered' : ''}`} onClick={close}>
            <div className={`wrapper ${props.className || ''}`} onClick={e => e.stopPropagation()}>
				{props.children}
            </div>
        </div>}
	</Portal>
}
