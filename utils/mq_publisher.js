const amqp = require('amqplib')


module.exports.getPublisher = (exchange,exType,listofbindingUsers,onError,url='amqp://localhost:5672')=>{
    let channel;
let connection;
    const start = async () => {
        if (channel) throw new Error('Already started');
        connection = await amqp.connect(url);
    
        channel = await connection.createChannel()
        await channel.assertExchange(exchange, exType, { durable: true })
        for (const key of listofbindingUsers) {
            channel.assertQueue(key,{durable:true})
            channel.bindQueue(key, exchange, key);
        }
      }
    
      const publish = async (key, message) => {
        if (!channel) throw new Error("QUEUE_NOT_STARTED")
        const buffer = Buffer.from(message)
        return channel.publish(exchange, key, buffer)
      }
    const stop = async () => {
        if (!channel) throw new Error('no channel to stop')
        await channel.close();
        channel = undefined
      }
    
      const close = async () => {
        if (!connection) throw new Error("NOT CONNECTED")
        await connection.close()
        channel = undefined
        connection = undefined
      }
      return {start,stop,publish,close}
}