import axios, { AxiosInstance } from "axios";

const PRISMIC_REPO_NAME = process.env.PRISMIC_REPO_NAME;
const PRISMIC_API_KEY = process.env.PRISMIC_ACCESS_TOKEN;
const PRISMIC_BASE_URL = process.env.PRISMIC_API_URL;

if (!PRISMIC_REPO_NAME || !PRISMIC_API_KEY || !PRISMIC_BASE_URL) {
	throw new Error("Prismic Env vars Not Provided");
}

export const PrismicApi: AxiosInstance = axios.create({
	baseURL: PRISMIC_BASE_URL,
	headers: {
		repository: PRISMIC_REPO_NAME,
		Authorization: PRISMIC_API_KEY,
	},
	timeout: 10000,
});
