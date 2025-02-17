import { createMocks } from 'node-mocks-http';
import handler from './route';

describe('Authentication Routes', () => {
	test('hello world!', async () => {
		const { req, res } = createMocks({
			method: 'POST',
		});
		await handler(req, res);
		expect(res._getStatusCode()).toBe(200);
	});
});