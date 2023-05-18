#!/usr/bin/env node
import * as amqp from 'amqplib'

import { exchange } from '.'

(async () => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'fanout', { durable: false })
    const queue = await channel.assertQueue('', { exclusive: true })
    await channel.bindQueue(queue.queue, exchange, '')
    await channel.consume(queue.queue, (message) => {
        console.info('[x] Message received:', message.content.toString())
    }, { noAck: true })
    console.info(`[x] Waiting for messages in ${queue.queue}. To exit press CTRL+C.`)
})()
