import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
import { fetchQuery, archiveQuery } from "./queries.js";
import { filterAndGroupListingsByContact } from "./utils.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const graphQLClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT, {
	headers: {
		authorization: `Basic ${btoa(`${process.env.GRAPHQL_TOKEN}:${process.env.GRAPHQL_SECRET}`)}`,
	},
});

app.get("/fetch", async (req, res) => {
	if (req.headers.authorization !== process.env.TOKEN) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const response = await graphQLClient.request(fetchQuery);	
		const filtered = filterAndGroupListingsByContact(response);
		if (response.error) {
			res.status(500).json({ error: response.error})
		}
		res.json(filtered);
	} catch (error) {
		res.status(500).json({ error: error.response.errors[0].message });
	}
});

app.post("/archive/:modelId", async (req, res) => {
	if (req.headers.authorization !== process.env.TOKEN) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const modelId = req.params.modelId;
	if (!modelId) {
		return res.status(400).json({ error: "Model ID is required" });
	}

	try {
		const variables = { modelId: modelId, state: "inactive" };
		const response = await graphQLClient.request(archiveQuery, variables);
		res.json({ message: `Model with ID ${modelId} has been archived`, response });
	} catch (error) {
		res.status(500).json({ error: error.response.errors[0].message });
	}
});

app.post("/login", (req, res) => {
	const credentials = req.body;
	if (credentials.username === process.env.USERNAME && credentials.password === process.env.PASSWORD) {
		res.json({ token: process.env.TOKEN });
	} else {
		res.status(401).json({ error: "Invalid credentials." });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});


