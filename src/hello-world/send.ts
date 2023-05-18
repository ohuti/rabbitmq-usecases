#!/usr/bin/env node
import * as amqp from 'amqplib'

import { queue } from '.'
import { sleep } from '../utils'

(async () => {
    const message = 'Hello, world!'
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: false })
    channel.sendToQueue(queue, Buffer.from(message))
    await sleep(2000)
    await connection.close()
})()
