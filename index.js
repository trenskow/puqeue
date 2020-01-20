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
