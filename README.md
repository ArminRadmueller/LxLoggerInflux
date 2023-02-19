# Loxone Logger to InfluxDB (LxLoggerInflux)

Integration of InfluxDB in a Loxone smart home to save values and to visualize in for example Grafana.

config.json
```
{

    "name" : "MySmartHome",

    "logLevel": "info",
    
    "influxdb": {
        "url": "http://192.168.178.200:8086",
        "token": "<MySecureInfluxDbAccessToken>",
        "org": "Monitoring",
        "bucket": "SmartHome"
    },

    "logger": {
        "port": 2022
    }

}
```

docker-compose.yml
```
version: "3"

services:

  LxLoggerInflux:
    container_name: LxLoggerInflux
    image: arminradmueller/lxloggerinflux:latest
    ports:
      - 2022:2022/udp
    restart: always
```
