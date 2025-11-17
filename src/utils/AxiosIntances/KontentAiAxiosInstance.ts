import axios, { AxiosInstance } from "axios";
const KONTENT_PROJECT_ID = process.env.KONTENT_PROJECT_ID;
const KONTENTAI_KEY = process.env.KONTENTAI_KEY;

if (!KONTENT_PROJECT_ID || !KONTENTAI_KEY) {
	throw new Error("KontentAI EnVars Not Provided");
}

export const kontentManagementApi: AxiosInstance = axios.create({
	baseURL: `https://manage.kontent.ai/v2/projects/${KONTENT_PROJECT_ID}`,
	headers: {
		Authorization: `Bearer ${KONTENTAI_KEY}`,
		"Content-Type": "application/json",
	},
	timeout: 10000,
});
