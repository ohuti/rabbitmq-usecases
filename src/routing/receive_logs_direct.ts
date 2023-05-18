import * as amqp from 'amqplib'

import { exchange } from '.'

(async () => {
    const args = process.argv.slice(2)
    if (args.length === 0) {
        console.error('[x] Usage: you must inform a least one severity level for this consumer. [info], [warning] or [error].')
        return
    }
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'direct', { durable: false })
    const queue = await channel.assertQueue('', { exclusive: true })
    for (const severity of args) {
        await channel.bindQueue(queue.queue, exchange, severity)
    }
    await channel.consume(queue.queue, (message) => {
        console.info(`[x] [${message.fields.routingKey.toUpperCase()}]: ${message.content.toString()}`);
    }, { noAck: true })
    console.info('[x] Waiting for logs. To exit press CTRL+C...')
})()
