export interface LivepeerImage {
	seed: number;
	url: string;
	nsfw: boolean;
}

export interface StateType {
	streaming_audio: boolean;
	streaming_text: boolean;
	waiting_for_images: boolean;
	current_request_id: string;
}

export interface ErrorType {
	error: string;
}

export interface TextType {
	delta: string;
}

export interface ImageType {
	urls: string[];
}

export interface RequestPayload {
	prompt: string;
	genre: Genre;
}

export interface Prompt {
	prompt: string;
	caveat?: string;
}

export type Genre =
	| "fiction"
	| "mystery"
	| "fantasy"
	| "historical"
	| "romance"
	| "science fiction"
	| "thriller"
	| "horror"
	| "drama"
	| "adventure"
	| "non-fiction"; // Traditional fiction genres
