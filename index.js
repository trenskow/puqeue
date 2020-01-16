'use strict';

module.exports = exports = class Queue {

	constructor(options = {}) {
		this._maxOperationCount = options.maxOperationCount || 1;
		this._operationCount = 0;
		this._queue = [];
	}

	async add(todo) {
		return new Promise((resolv, reject) => {
			this._queue.push({
				todo,
				resolv,
				reject
			});
			this._checkQueue();
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

			queueItem.todo()
				.then((...args) => {
					done();
					queueItem.resolv(...args);
				})
				.catch((err) => {
					done();
					queueItem.reject(err);
				});
			
		}
	}
	
};
