#!/usr/bin/env node
import * as amqp from 'amqplib'

import { queue } from '.'
import { sleep } from '../utils'

(async () => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    await channel.prefetch(1)
    await channel.consume(queue, async (message) => {
        const seconds = message.content.toString().split('.').length - 1
        console.info('[x] Message received:', message.content.toString())
        await sleep(seconds * 1000)
        channel.ack(message)
        console.info('[x] Done')
    }, { noAck: false })
    console.info(`[x] Waiting for messages from ${queue}.`, 'Press CTRL+C do exit.')
})()
