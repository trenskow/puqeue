puqeue
----

# Introduction

A small JS library for queuing promises.

# Use

````javascript
const Puqeue = require('puqeue');

const queue = new Puqeue();

await queue.add(async () {
    // My todo
});
````

You can await multiple promises in a queue by using `Promise.all`.

````javascript
await Promise.all(
    queue.add(async () {
        console.info(1);
    }),
    queue.add(async () {
        console.info(3);
    }, { priority: 100 }),
    queue.add(async () {
        console.info(2);
    })
);
````

The above example will execute one at the time, but second operation will execute last due to priority.

> Default priority is `10`.

## Options

You specify the maximum number of concurrent promises run with an option.

````javascript
new Puqeue({ maxOperationCount: 2 });
````

> Use `0` to indicate no limit (default is `1`).

# LICENSE

See LICENSE.
