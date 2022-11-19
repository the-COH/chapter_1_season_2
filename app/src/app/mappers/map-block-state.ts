import { BlockState } from '../enums/block-state';

export const mapBlockStateToName = (blockState: BlockState) => {
	switch (blockState) {
		case BlockState.Installed:
			return 'Installed';
		case BlockState.PendingInstall:
			return 'Pending Install';
		case BlockState.PendingRemove:
			return 'Pending Remove';
		default:
			return '';
	}
};
