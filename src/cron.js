const express = require('express')
const app = express()
const { streamTopics, getStreamConsumer } = require('./redis-stream');

app.get('/', function (req, res) {
    res.send('Hello World')
});

const consumerIndex = process.argv[2];

const port = Number(`301${consumerIndex}`)

const start = async () => {
    const groupName = `cron`;
    const consumerName = `instance_${consumerIndex}`;

    const streamConsumer1 = await getStreamConsumer(streamTopics.SHIFT_ENDED, groupName, consumerName);
    streamConsumer1.StartConsuming();

    const streamConsumer2 = await getStreamConsumer(streamTopics.INVOICE_GENERATED, groupName, consumerName);
    streamConsumer2.StartConsuming();

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
};

start();