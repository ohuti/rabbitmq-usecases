import * as amqp from 'amqplib'

import { exchange } from '.'
import { sleep } from '../utils'

(async () => {
    const args = process.argv.slice(2)
    const message = args.slice(1).join(' ') || 'Hello, world!'
    const severity = args.length > 1 ? args[0].toLowerCase() : 'info'
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'direct', { durable: false })
    channel.publish(exchange, severity, Buffer.from(message))
    console.info(`[x] Message sent to ${exchange} with routing key ${severity}.`)
    await sleep(2000)
    await connection.close()
})()
