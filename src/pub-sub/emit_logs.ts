#!/usr/bin/env node
import * as amqp from 'amqplib'

import { exchange } from '.'
import { sleep } from '../utils'

(async () => {
    const message = process.argv.slice(2).join(' ') || 'Hello, world!'
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'fanout', { durable: false })
    channel.publish(exchange, '', Buffer.from(message))
    console.info('[x] Message sent to', exchange)
    await sleep(2000)
    await connection.close()
})()
