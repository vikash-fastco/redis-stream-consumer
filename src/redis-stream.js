const nrs = require('node-redis-streams')
const Redis = require('ioredis')

const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};

const redis = new Redis(config)
redis.on('connect', () => {
    console.log('Connected to ioredis');
});

const createConsumerGroup = async (streamName, groupName) => {
    try {
        await redis.xgroup('CREATE', streamName, groupName, '$', 'MKSTREAM');
        console.log(`Consumer group ${groupName} created for stream ${streamName}`);
    } catch (err) {
        if (err.message.includes('BUSYGROUP')) {
            console.log(`Consumer group ${groupName} already exists`);
        } else {
            throw err;
        }
    }
}

module.exports.getStreamConsumer = async (streamName, groupName, consumerName) => {
    await createConsumerGroup(streamName, groupName);
    return new nrs.Consumer({
        consumerName,
        groupName,
        readItems: 5,
        recordHandler: async (record) => {
            console.log(`Got record ${streamName} ${groupName} ${consumerName}`, record)
            if (record.reclaimed) {
                console.log('this was a reclaimed record!')
            }
        },
        errorHandler: async (record) => {
            console.error('ERROR DETECTED FOR RECORD', record)
        },
        redisClient: redis,
        streamName,
        blockIntervalMS: 1000,
        checkAbandonedMS: 2000
    });
}


module.exports.publishMessage = async (streamName, value) => {
    await redis.xadd(streamName, '*', 'message', value);
    console.log(`Stream ${streamName} created`);
}
