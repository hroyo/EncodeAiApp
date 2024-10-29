/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// await import("./src/env.js")

/** @type {import("next").NextConfig} */
const config = {
	eslint: {
		ignoreDuringBuilds: true,  // This disables ESLint during the build process
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.livepeer.cloud",
				port: "",
				pathname: "/stream/**",
			},
			{
				protocol: "https",
				hostname: "obj-store.livepeer.cloud",
				port: "",
				pathname: "/livepeer-cloud-ai-images/**",
			},
			{
				protocol: "https",
				hostname: "agency-missions.s3.us-east-2.amazonaws.com", // Add S3 bucket for character images
				port: "",
				pathname: "/characters/**",
			},
			{
				protocol: "https",
				hostname: "ipfs.io", // Add IPFS gateway for character images
				port: "",
				pathname: "/ipfs/**",
			},
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});
		config.externals.push("pino-pretty", "lokijs", "encoding");

		return config;
	},
};





export default config
