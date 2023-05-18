import * as amqp from 'amqplib'

import { fibonacci, queue } from '.'

(async () => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: false })
    await channel.prefetch(1)
    await channel.consume(queue, (message) => {
        const n = parseInt(message.content.toString())
        console.info(`[x] fib(${n})`)
        const result = fibonacci(n)

        channel.sendToQueue(message.properties.replyTo, Buffer.from(result.toString()), { correlationId: message.properties.correlationId })
        channel.ack(message)
    })
    console.info('[x] Awaiting RPC requests. To exit press CTRL+C...')
})()
