import React from 'react';
import { createRoot } from 'react-dom/client';
import { CompilerProvider, ContractProvider, WalletProvider } from './contexts';
import { App } from './app';
import './index.css';

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);
const root = createRoot(container);

root.render(
	[
		CompilerProvider,
		WalletProvider,
		ContractProvider,
	]
		.reverse()
		.reduce((acc, Provider) => (
			<Provider>{acc}</Provider>
		), <App />)
);
