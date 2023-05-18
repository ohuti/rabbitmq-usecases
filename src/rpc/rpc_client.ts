import * as amqp from 'amqplib'
import { v4 as uuid } from 'uuid'

import { queue } from '.'
import { sleep } from '../utils'

(async () => {
    const args = process.argv.slice(2)
    if (args.length === 0) {
        console.error('[x] Please inform at least one number greater than 0.')
        return
    }
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    const resp_queue = await channel.assertQueue('', { exclusive: true })
    const correlationId = uuid()
    const num = parseInt(args[0])
    console.info(`[x] Requesting fib(${num})`)
    await channel.consume(resp_queue.queue, async (message) => {
        if (message.properties.correlationId !== correlationId) return
        console.log(`[x] Got ${message.content.toString()}`)
        sleep(2000)
        await connection.close()
    }, { noAck: true })
    channel.sendToQueue(queue, Buffer.from(num.toString()), { correlationId, replyTo: resp_queue.queue })
})()
