import { use as useChai, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

useChai(chaiAsPromised);

import Puqeue from '../index.js';

describe('Puqeue', () => {
	it ('should come back executed in correct order.', async () => {
		const queue = new Puqeue({ maxOperationCount: 3 });
		let result = 0;
		queue.add(async () => result += 2);
		queue.add(async () => result += 2);
		queue.add(async () => result += 2);
		queue.add(async () => result *= 2, { priority: 100 });
		queue.add(async () => result = Math.pow(result, 2), { priority: 1000 });
		queue.add(async () => result *= 2, { priority: 100 });
		queue.add(async () => result = Math.pow(result, 2), { priority: 1000 });
		queue.add(async () => result *= 2, { priority: 100 });
		queue.add(async () => result = Math.pow(result, 2), { priority: 1000 });
		await expect(queue.waitAll(() => result)).to.eventually.equal(28179280429056);
	});
});
