const amqp = require('amqplib')


module.exports.getConsumer = (qname,exchange,exType,onError,url='amqp://localhost:5672')=>{
    let channel;
let connection;
    const start = async (onMsgCallback) => {
        if (channel) throw new Error('Already started');
        connection = await amqp.connect(url);
    
        channel = await connection.createChannel()
        await channel.assertExchange(exchange, exType, { durable: true })
        const result = await channel.assertQueue(qname, { exclusive: false });
        const { queue } = result;
        channel.prefetch(1);
        channel.consume(queue, onMsgCallback,{noAck:true});
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
      return {start,stop,close}
}
