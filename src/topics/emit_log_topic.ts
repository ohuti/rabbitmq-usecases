import * as amqp from 'amqplib'

import { exchange } from '.'
import { sleep } from '../utils'

(async () => {
    const args = process.argv.slice(2)
    const message = args.slice(1).join(' ') || 'Hello, world!'
    const key = args.length > 0 ? args[0].toLowerCase() : 'anonymous.info'
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'topic', { durable: false })
    channel.publish(exchange, key, Buffer.from(message))
    console.info(`[x] Message sent to ${exchange} with routing key ${key}.`)
    await sleep(2000)
    await connection.close()
})()
