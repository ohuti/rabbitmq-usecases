#!/usr/bin/env node
import * as amqp from 'amqplib'

import { queue } from '.'
import { sleep } from '../utils'

(async () => {
    const message = process.argv.slice(2).join(' ') || 'Hello, world!'
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true })
    console.info('[x] Message sent to', queue)
    await sleep(2000)
    await connection.close()
})()
