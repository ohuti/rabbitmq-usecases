#!/usr/bin/env node
import * as amqp from 'amqplib'

import { queue } from '.'

(async () => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: false })
    await channel.consume(queue, (message) => {
        console.info('[x] Message received:', message.content.toString())
    }, { noAck: true })
    console.info('[x] Waiting for messages from', queue)
})()
