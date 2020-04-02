const server = require('http').createServer((req, res) => res.end("123"));
const io = require('socket.io')(server);

const db = new Map();

io.on('connection', client => {
    console.log('a user connected');
    // client.on('event', data => { /* … */ });
    client.on('first', (msg) => {
        console.log(msg);
        db.set(msg, client);
    });
    client.on('send', (msg) => {
        // console.log(msg);
        if (db.has(msg.target)) {
            db.get(msg.target).emit('receive', msg);
        } else {
            client.emit('failed', "failed");
            console.log("failed", msg.target, db.keys());
        }
    });
    client.on('disconnect', () => { console.log('user disconnected'); });
});
server.listen(3000, "127.0.0.1", () => {
    console.log('listening on *127.0.0.1:3000');
});