'use strict';

module.exports = exports = class Queue {

	constructor(options = {}) {
		this._name = options.name;
		this._maxOperationCount = options.maxOperationCount || 1;
		this._operationCount = 0;
		this._queue = [];
	}

	get name() {
		return this._name;
	}

	get maxOperationCount() {
		return this._maxOperationCount;
	}

	set maxOperationCount(maxOperationCount) {
		this._maxOperationCount = maxOperationCount;
		this._checkQueue();
	}

	get operationCount() {
		return this._operationCount;
	}

	async add(todo, options = {}) {

		options.priority = options.priority || 10;

		return new Promise((resolve, reject) => {

			this._queue.push({
				todo,
				resolve,
				reject,
				options
			});

			this._queue.sort((item1, item2) => item1.options.priority - item2.options.priority);

			this._checkQueue();

		});

	}

	async waitAll(todo) {
		return await this.add(todo, {
			priority: Infinity
		});
	}

	_checkQueue() {

		if (this._queue.length > 0 && (!this._maxOperationCount || this._operationCount < this._maxOperationCount)) {

			let queueItem = this._queue.shift();
			this._operationCount++;

			const done = () => {
				this._operationCount--;
				this._checkQueue();
			};

			Promise.resolve(typeof queueItem.todo === 'function' ? queueItem.todo() : queueItem.todo)
				.then((...args) => {
					done();
					queueItem.resolve(...args);
				})
				.catch((err) => {
					done();
					queueItem.reject(err);
				});

		}

	}

};
