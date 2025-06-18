import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
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
		inputs: ['main'],
		outputs: ['main'],
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
				displayName: 'Redis Host',
				name: 'host',
				type: 'string',
				default: 'localhost',
				placeholder: 'localhost',
				description: 'Redis server hostname',
				required: true,
			},
			{
				displayName: 'Redis Port',
				name: 'port',
				type: 'number',
				default: 6379,
				description: 'Redis server port',
				required: true,
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
				const host = this.getNodeParameter('host', i) as string;
				const port = this.getNodeParameter('port', i) as number;
				const waitTime = this.getNodeParameter('waitTime', i) as number;

				if (!threadId) {
					throw new NodeOperationError(this.getNode(), 'Thread ID is required');
				}

				// Wait for the specified time
				await new Promise(resolve => setTimeout(resolve, waitTime * 1000));

				// Connect to Redis
				const client = createClient({
					socket: {
						host,
						port,
					},
				});

				await client.connect();

				try {
					// Get all messages from the Redis list
					const messages = await client.lRange(threadId, 0, -1);
					
					// Aggregate messages
					const content = messages.join('\n');

					// Delete the Redis key after collection
					await client.del(threadId);

					// Return the result
					returnData.push({
						json: {
							threadId,
							content,
							messageCount: messages.length,
							collectedAt: new Date().toISOString(),
						},
					});
				} finally {
					await client.disconnect();
				}
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Redis Collector failed: ${error.message}`,
					{ itemIndex: i }
				);
			}
		}

		return [returnData];
	}
}