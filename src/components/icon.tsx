import React from 'react';
import {MaterialIcons} from './material-icons';

export type IconProps = {
	src: MaterialIcons;
	className?: string;
	outlined?: boolean;
};
export const Icon = (props: IconProps) => {
	const {src, className = '', outlined} = props;
	return <i className={`icon ${outlined ? 'outlined' : ''} ${className}`}>{src}</i>;
};
