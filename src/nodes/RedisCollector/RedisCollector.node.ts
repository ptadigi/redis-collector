import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { createClient } from 'redis';

export class RedisCollector implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Redis Collector',
		name: 'redisCollector',
		icon: 'file:redisCollector.svg',
		group: ['input'],
		version: 1,
		description: 'Collect messages from Redis and aggregate them',
		defaults: {
			name: 'Redis Collector',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'redis',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				default: '',
				placeholder: 'Enter thread ID',
				description: 'The Redis key/thread ID to collect messages from',
				required: true,
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				placeholder: 'Enter content to process',
				description: 'Content to be processed with Redis messages',
				required: false,
			},
			{
				displayName: 'Wait Time (seconds)',
				name: 'waitTime',
				type: 'number',
				default: 5,
				placeholder: '5',
				description: 'Time to wait before collecting messages',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const threadId = this.getNodeParameter('threadId', i) as string;
				const content = this.getNodeParameter('content', i) as string;
				const waitTime = this.getNodeParameter('waitTime', i) as number;

				if (!threadId) {
					throw new NodeOperationError(this.getNode(), 'Thread ID is required');
				}

				// Get Redis credentials
				const credentials = await this.getCredentials('redis');
				if (!credentials) {
					throw new NodeOperationError(this.getNode(), 'Redis credentials are required');
				}

				// Wait for the specified time
				await new Promise(resolve => setTimeout(resolve, waitTime * 1000));

				// Connect to Redis
				const client = createClient({
					socket: {
						host: credentials.host as string,
						port: credentials.port as number,
					},
					username: credentials.username as string,
					password: credentials.password as string,
				});

				await client.connect();

				try {
					// Get all messages from the Redis list
					const messages = await client.lRange(threadId, 0, -1);
					
					// Aggregate messages
					const collectedContent = messages.join('\n');

					// Delete the Redis key after collection
					await client.del(threadId);

					// Return the result
					returnData.push({
						json: {
							threadId,
							inputContent: content,
							collectedMessages: collectedContent,
							messageCount: messages.length,
							collectedAt: new Date().toISOString(),
							messages: messages,
						},
					});
				} finally {
					await client.disconnect();
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				throw new NodeOperationError(
					this.getNode(),
					`Redis Collector failed: ${errorMessage}`,
					{ itemIndex: i }
				);
			}
		}

		return [returnData];
	}
}