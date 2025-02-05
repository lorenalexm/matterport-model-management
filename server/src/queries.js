import { gql } from "graphql-request";

export const fetchQuery = gql`
	query {
		models(pageSize: 1000, sortBy: [{ field: created, order: asc }]) {
			results {
				id,
				state,
				name,
				created,
				address {
					address
				},
				publication {
					contact {
						email,
						name
					},
				},
			}
			totalResults
		}
	}
`;

export const archiveQuery = gql`
mutation toggleModelActivation($modelId: ID!, $state: ModelStateChange!){
	updateModelState(
		id: $modelId,
		state: $state
	){
		id
		}
	}
`;

/*
{
  "modelId": "",
  "state": "inactive"
}
*/
