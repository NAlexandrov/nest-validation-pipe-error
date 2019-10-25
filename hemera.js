const Hemera = require('nats-hemera');
const nats = require('nats').connect();

const hemera = new Hemera(nats, {
  logLevel: 'silent'
});

hemera.ready(async () => {
  try {
    const { data } = await hemera.act({
      cmd: 'test',
      topic: 'test',
      payload: {
        name: 'World',
      },
    });
    console.log(data);
  } catch (err) {
    console.error('Error!');
  }

  process.exit(0);
});
