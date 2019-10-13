import React, {ReactElement, ReactNode} from "react";

export interface TabProps {
	className?: string;
	value: number;
	onChange: (value: number) => any;
	children: ReactElement<TabItemProps>[] | ReactElement<TabItemProps>;
}

export interface TabItemProps {
	icon?: ReactNode;
	label: ReactNode;
	badge?: any;
}

export const Tab = (props: TabProps) => {
	const {value, onChange, className} = props;
	const items = Array.isArray(props.children) ? props.children : [props.children];
	return <div className={`tab ${className || ''}`}>
		{items.map((tab, i) => <div key={i} className={`item ${value === i ? 'is-active' : ''}`} onClick={() => onChange(i)}>
			{tab.props.icon && <div className="icon">
				{tab.props.icon}
            </div>}
			<label>
				{tab.props.label}
				{!!tab.props.badge && <div className="badge">{tab.props.badge}</div>}
			</label>
		</div>)}
	</div>;
};

export const TabItem = (props: TabItemProps): any => {
	return null;
};
