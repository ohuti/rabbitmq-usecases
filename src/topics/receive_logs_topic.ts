import * as amqp from 'amqplib'

import { exchange } from '.'

(async () => {
    const args = process.argv.slice(2)
    if (args.length === 0) {
        console.error('[x] Usage: you must inform origin and severity level for this consumer. <origin>.<severity>')
        return
    }
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'topic', { durable: false })
    const queue = await channel.assertQueue('', { exclusive: true })
    for (const key of args) {
        await channel.bindQueue(queue.queue, exchange, key)
    }
    await channel.consume(queue.queue, (message) => {
        console.info(`[x] [${message.fields.routingKey.toUpperCase()}]: ${message.content.toString()}`);
    }, { noAck: true })
    console.info('[x] Waiting for logs. To exit press CTRL+C...')
})()
