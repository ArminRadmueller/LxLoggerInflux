const logging = require('yalm')
import {EventEmitter} from 'events';
import {InfluxDB, Point } from '@influxdata/influxdb-client'

declare interface InfluxDbTag { name: string; value: string; }

class InfluxDbClient extends EventEmitter { 
    private URL : string;
    private Token : string;
    private Organization : string;
    private Bucket : string;

    private Client : any;
    private ClientWriteApi : any;

    public Connected : boolean = false;
 
    public constructor(url:string,token:string,organization:string,bucket:string)
    { 
        super();
        this.URL = url;
        this.Token = token;
        this.Organization = organization;
        this.Bucket = bucket;
        try
        {
            logging.debug('InfluxDB connecting to ' + this.URL);
            this.Client = new InfluxDB({url: this.URL, token: this.Token});
            logging.debug('InfluxDB opening ' + this.Organization + ' >> ' + this.Bucket);
            this.ClientWriteApi = this.Client.getWriteApi(this.Organization, this.Bucket);
            this.Connected = true;
            logging.debug('InfluxDB connected');
        }
        catch ( error )
        {
            this.Connected = false;
            logging.debug('InfluxDB disconnected');
            logging.error((error as Error).message);
        }
    }
 
    public write(measurement:string,tag:InfluxDbTag,field:string,value:number)
    {
        if (this.Connected == false)
        {
            logging.error('InfluxDB is not connected, data is not written to the database');
        }
        else
        {
            
            try
            {
                logging.debug('InfluxDB writing data to ' + measurement);
                const point = new Point(measurement).floatField(field,value).tag(tag.name,tag.value);
                this.ClientWriteApi.writePoint(point);
                logging.debug('InfluxDB flushing data');
                this.ClientWriteApi.flush();
            }
            catch ( error )
            {
                logging.error((error as Error).message);
            }

        }

    }
    
}

export {InfluxDbClient}
