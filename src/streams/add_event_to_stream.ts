import * as amqp from 'amqplib'

import { sleep } from '../utils'

(async () => {
    const user = {
        name: 'André',
        email: 'andre@test.com',
        createdAt: new Date().toISOString(),
        updatedAt: null
    }
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue('my-stream', { durable: true, exclusive: false, autoDelete: false, arguments: {
        'x-queue-type': 'stream',
        'x-max-length-bytes': 20_000_000_000,
        'x-stream-max-segment-size-bytes': 100_000_000
    }})

    const userCreated = {
        event: 'UserCreated',
        ocurredAt: user.createdAt,
        data: user
    }
    channel.sendToQueue('my-stream', Buffer.from(JSON.stringify(userCreated)))

    user.name = 'André Ohuti'
    user.updatedAt = new Date().toISOString()
    const userUpdated = {
        event: 'UserUpdated',
        ocurredAt: user.updatedAt,
        data: user
    }
    channel.sendToQueue('my-stream', Buffer.from(JSON.stringify(userUpdated)))

    await sleep(2000)
    await connection.close()
})()
