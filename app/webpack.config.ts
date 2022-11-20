import { join } from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
	mode: isDevelopment ? 'development' : 'production',
	devtool: isDevelopment ? 'source-map' : false,
	target: 'web',
	entry: {
		index: join(__dirname, 'src', 'index'),
	},
	output: {
		path: join(__dirname, 'dist'),
		filename: 'js/[name].js',
		assetModuleFilename: 'assets/[hash][ext][query]',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDevelopment,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDevelopment,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				exclude: [/node_modules/],
				use: ['ts-loader'],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles/[name].css',
		}),
		new HtmlWebpackPlugin({
			title: 'Carbon',
			filename: 'index.html',
			xhtml: true,
			base: './',
		}),
		new CopyPlugin({
			patterns: [{ from: 'assets', to: 'assets/' }],
		}),
	],
	devServer: {
		host: '0.0.0.0',
		allowedHosts: 'all',
		compress: true,
		// port: 3000,
		hot: true,
		liveReload: true,
		// client: {
		// 	webSocketURL: {
		// 		protocol: 'https',
		// 		hostname: 'bl.ngrok.io',
		// 		pathname: '/ws',
		// 		port: 443,
		// 	},
		// },
		// static: distPath
	},
	watch: isDevelopment,
	performance: {
		maxAssetSize: 5000000,
		maxEntrypointSize: 5000000,
	},
};

export default config;
