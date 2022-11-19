import React, { useState } from 'react';
import { BlockState } from '../enums/block-state';
import { mapBlockStateToName } from '../mappers/map-block-state';
import { Toggle } from './toggle';

namespace ContractBlock {
    export type Props = {
        block: {
            name: string
            description: string
            state: BlockState
        }

    }

}
export const ContractBlock = ({ block }: ContractBlock.Props) => {
	const [checked, setChecked] = useState(false);

	return (
		<div className="flex flex-col w-[320px] p-[20px] border rounded-[5px]">
			<img className="w-[54px] h-[54px] mb-[25px]" src="/assets/images/block-icon.png" alt="" />

			<div className="text-[34px] leading-[40px]">{block.name}</div>
			<div className="text-[18px] leading-[21px]">{block.description}</div>

			<div className="flex items-center mt-[75px]">
				<div className="text-[16px] leading-[19px] grow">{mapBlockStateToName(block.state)}</div>
				<Toggle checked={checked} disabled={false} onChange={(checked) => setChecked(checked)} />
			</div>
		</div>
	);
};
