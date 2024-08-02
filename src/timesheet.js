const express = require('express')
const app = express()
const { streamTopics, getStreamConsumer } = require('./redis-stream');

app.get('/', function (req, res) {
    res.send('Hello World')
});

const consumerIndex = process.argv[2];

const port = Number(`302${consumerIndex}`)

const start = async () => {
    const groupName = `timesheet`;
    const consumerName = `instance_${consumerIndex}`;

    const streamConsumer1 = await getStreamConsumer(streamTopics.SHIFT_ENDED, groupName, consumerName);
    streamConsumer1.StartConsuming();

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
};

start();