// app/layout.tsx
import "@/styles/globals.css";
import { Montserrat, Roboto, Crimson_Pro } from "next/font/google";
import type { Metadata } from "next";
import { headers } from 'next/headers'

import { Web3Provider } from "@repo/auth/Web3Provider";
import { SessionProvider } from '@repo/auth/SessionProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { AppProvider } from '@toolpad/core';
import { Home as HomeIcon, Description as DescriptionIcon } from "@mui/icons-material"; // Placeholder icons

import { config } from '@repo/auth/config';

import ContextProvider from "@repo/auth/context/index.tsx"

import Layout from "../components/Layout";
import UserAiIcon from '../../public/user-ai.svg';
import OriginStory from '../../public/origin-story.svg';
import Evidence from '../../public/evidence.svg';


// import Web3ModalProvider from '../context/index'
import { cookieToInitialState } from 'wagmi'
// import { config } from '@repo/auth/config/index'

const montserrat = Montserrat({ subsets: ['latin'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });
const crimsonPro = Crimson_Pro({ subsets: ['latin'], weight: ['400', '700', '800'] });

// Metadata configuration
export const metadata: Metadata = {
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	title: "Read Daily Stories and Manga with Friends",
	description: 'CRYTPO-Z Social-Publishing connects creators and storytellers with their readers directly on social media across many genres including romance, comedy, action, fantasy, and horror. Read comics, webcomics, manga, and manhwa online',
	generator: 'Next.js',
	applicationName: 'Crypto-Z',
	referrer: 'origin-when-cross-origin',
	keywords: ['CRYTPO-Z', 'web3', 'crypto', 'Publishing', 'Digital Comics', 'Online Comics', 'Free Comics', 'Webcomics', 'Manga', 'Manhwa'],
	authors: [{ name: 'Hadrien', url: 'https://www.crypto-z.com' }],
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: '/',
		languages: {
			'en-US': '/en-US',
		},
	},
	openGraph: {
		title: "Social-Publishing – Daily Stories and Manga with Friends",
		description: 'CRYTPO-Z Social-Publishing connects creators and storytellers with their readers directly on social media across many genres including romance, comedy, action, fantasy, and horror. Read comics, webcomics, manga, and manhwa online',
		url: 'https://www.crypto-z.com',
		siteName: 'Crypto-Z',
		images: [
			{
				url: 'https://www.crypto-z.com/crypto-z-thumb.jpg', // Must be an absolute URL
				width: 1200,
				height: 630,
				alt: 'Home',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
};

// Define the navigation structure
const NAVIGATION = [
	{
		kind: 'header',
		title: 'Storytelling',
	},
	{
		segment: "create-character",
		title: "Create Your Agent",
		icon: <UserAiIcon />,

	},
	{
		segment: "create-character-story",
		title: "Create Your Origin Story",
		icon: <OriginStory />,
	},

	{
		segment: "create-evidence",
		title: "Create Evidence",
		icon: <Evidence />,
		// action: <Chip label={7} color="primary" size="small" />, // Use Chip here
	},


	{
		kind: 'divider',
	},

];

// Branding configuration
const branding = {
	logo: <img src="/LOGO.svg" alt="Crypto-Z logo" />, // Customize with your logo
	title: "",
};

// RootLayout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
	// const initialState = cookieToInitialState(config, headers().get('cookie'));
	const cookies = headers().get('cookie')

	return (
		<html lang="en" suppressHydrationWarning className={`${montserrat.className} ${crimsonPro.className}`}>  {/* Add Crimson Pro */}
			<body>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<CssBaseline />

					{/* Move Web3Provider higher to wrap all components */}
					<ContextProvider cookies={cookies}>
						<Web3Provider>
							<SessionProvider>

								<AppProvider
									// @ts-expect-error
									navigation={NAVIGATION}
									branding={branding}
									theme={theme}
								>
									{/* <DashboardLayout
										slots={{
											toolbarActions: ProfileMenu, // ProfileMenu component as account info
										}}
									> */}
									<Layout>
										{/* Render the page content */}
										{children}
									</Layout>
									{/* </DashboardLayout> */}
								</AppProvider>
							</SessionProvider>
						</Web3Provider>
					</ContextProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}