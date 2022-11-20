import { Switch } from '@headlessui/react';
import React, { useState } from 'react';

type Props = {
	checked: boolean
	disabled: boolean
	onChange: (checked: boolean) => void
}

export const Toggle: React.FC<Props> = ({
	checked = false,
	disabled = false,
	onChange,
}) => {
	const [enabled, setEnabled] = useState(false);

	React.useMemo(() => {
		setEnabled(checked);
	}, [checked]);

	const handleChange = (c: boolean) => {
		onChange(c);
	};

	const cursor = disabled ? 'default' : 'pointer';
	const bgColorEnabled = 'bg-white';
	const bgColorNotEnabled = 'bg-white';
	const height = 'h-[42px]';
	const width = 'w-[81px]';
	const switchSize = 'h-[33px] w-[33px]';
	const switchTransform = 'translate-x-[40px]';
	const marginRight = 'mr-3';

	return (
		<Switch
			checked={checked}
			disabled={disabled}
			onChange={handleChange}
			className={`${enabled ? bgColorEnabled : bgColorNotEnabled}
          relative flex ${height} ${width} ${marginRight} shrink-0 ${cursor} rounded-[5px] border border-black transition-colors duration-200 ease-in-out focus:outline-none pt-[3px]`}
		>
			<span
				aria-hidden="true"
				className={`${enabled ? switchTransform : 'translate-x-[5px]'} pointer-events-none inline-block ${switchSize} transform rounded-[2px] bg-black ring-0 transition duration-200 ease-in-out`}
			/>
		</Switch>
	);
};
