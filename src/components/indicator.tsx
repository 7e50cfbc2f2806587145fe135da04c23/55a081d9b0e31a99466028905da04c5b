import React from 'react';

export interface IndicatorProps {
	percent: number;
	failed?: boolean;
}

export const Indicator = (props: IndicatorProps) => <div className={`indicator ${props.failed ? 'has-error' : ''}`}>
	<div style={{width: `${props.percent}%`}}/>
</div>;
