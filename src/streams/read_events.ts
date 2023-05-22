import * as amqp from 'amqplib'

(async (offset: 'first' | 'last'| 'next'| number = 'first') => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue('my-stream', { durable: true, exclusive: false, autoDelete: false, arguments: {
        'x-queue-type': 'stream',
        'x-max-length-bytes': 20_000_000_000,
        'x-stream-max-segment-size-bytes': 100_000_000
    }})
    await channel.prefetch(1)
    await channel.consume('my-stream', (message) => {
        const event = JSON.parse(message.content.toString())
        console.info(`[x] Event ${event.event} received at ${event.ocurredAt}.`)
        console.info(`  [-] User name: ${event.data.name}.`)
        console.info(`  [-] User e-mail: ${event.data.email}.`)
        channel.ack(message)
    }, { arguments: { 'x-stream-offset': offset }})
    console.info('[x] Waiting for logs. To exit press CTRL+C...')
})()
