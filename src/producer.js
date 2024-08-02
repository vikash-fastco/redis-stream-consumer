const express = require('express')
const app = express()
const { streamTopics, publishMessage } = require('./redis-stream');

app.get('/', async function (req, res) {
    return res.send(`
        <ul> \
            <li>Produce from anywhere</li> \
            <li>Subscribe from anywhere</li> \
            <li>Only 1 instance of a service should receive a message \
            <ul> \
                <li>Side-effect from the event should executed only once</li> \
            </ul> \
            </li> \
            <li>Multiple services can receive the same message (optional) \
            <ul> \
                <li>We might want to do multiple stuffs for the same event in different services. Eg.,</li> \
                <li>On Shift Ended<ul> \
                <li>Cron receives a message to process no-shows</li> \
                <li>Timesheet received a message to send bill reports</li></ul></li> \
                <li>On Invoice Generated<ul> \
                <li>Cron receives a message to send XERO files</li></ul></li> \
            </ul> \
            </li> \
            <li>Stream = event type</li> \
            <li>Group = service</li> \
            <li>Consumer = instance</li> \
        </ul> \
    `);
})

app.get('/send', async function (req, res) {
    for (let i = 1; i < 12; i++) {
        await publishMessage(streamTopics.SHIFT_ENDED, `${i}`)
        await publishMessage(streamTopics.INVOICE_GENERATED, `${i}`)
    }
    return res.send();
})

const start = async () => {
    app.listen(3000)
};

start();