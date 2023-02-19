const logging = require('yalm')
import dgram = require('dgram');
import {EventEmitter} from 'events';
    
declare interface LxLoggerServer {
    on(event: 'receive', listener: (message:string) => void): this;
    on(event: string, listener: Function): this;
}

class LxLoggerServer extends EventEmitter { 
    private Port : number;
    private Socket : dgram.Socket;

    public Connected : boolean = false;
  
    public constructor(Port:number)
    { 
        super();
        this.Port = Port;
        this.Socket = dgram.createSocket('udp4');
        this.Socket.on('listening', () => { this.Connected = true; logging.info('udp-socket listening on ' + this.Socket.address().address + ':' + this.Socket.address().port) });
        this.Socket.on('close', () => { this.Connected = false; logging.info('udp-socket shutdown and connection closed') });
        this.Socket.on('error', (error:Error) => { this.errorHandler(error) });
        this.Socket.on('message', (message:Buffer, remote:dgram.RemoteInfo) => { this.receive(message,remote) });
        this.Socket.bind(this.Port);
    }
 
    private receive(message:Buffer, remote:dgram.RemoteInfo)
    {
        let messageText:string = message.toString().trim();
        logging.info('udp-socket received message from ' + remote.address + ':' + remote.port + ' => "' + messageText + '"');
        this.emit('receive',messageText);
    }

    private errorHandler(error:Error)
    {
        logging.error((error as Error).message)
    }

}

export {LxLoggerServer}
