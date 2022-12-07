/** @type {import('next').NextConfig} */
const withAntdLess = require('next-plugin-antd-less');

const nextConfig = {
	// optional
	modifyVars: { '@primary-color': '#cb6916' },
	// optional
	lessVarsFilePath: './src/styles/variables.less',
	// optional
	lessVarsFilePathAppendToEndOfContent: false,
	// optional https://github.com/webpack-contrib/css-loader#object
	cssLoaderOptions: {},
  
	// Other Config Here...
  
	webpack(config) {
	  return config;
	},
  
	// ONLY for Next.js 10, if you use Next.js 11, delete this block
	future: {
	  webpack5: true,
	},
}

module.exports = withAntdLess((nextConfig))
