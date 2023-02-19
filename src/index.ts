#!/usr/bin/env node

const logging = require('yalm')
const config = require(process.argv[2] || '../config.json')

import {InfluxDbClient} from "./influxdb"
import {LxLoggerServer} from "./loxone"

logging.setLevel(config.logLevel)

logging.info('Loxone Logger to InfluxDB (LxLoggerInflux) starting...')

var LxLogger = new LxLoggerServer(config.logger.port);
LxLogger.on('receive', (message:string) => { processIncomingMessage(message) } );

var InfluxDb = new InfluxDbClient(config.influxdb.url, config.influxdb.token, config.influxdb.org, config.influxdb.bucket);

function processIncomingMessage(message:string)
{
    try
    {
        let data = message.split(';');
        
        if (data.length > 1)
        {
            const type : string = data[1];
            const room : string = data[2];
            const value : number = parseFloat(data[3]);
            InfluxDb.write(config.name, { name:'Raum', value:room }, type, value)
        }

    }
    catch ( error )
    {
        logging.error((error as Error).message);
    }
}
