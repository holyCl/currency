## run project
```
docker-compose build
docker-compose up
```

## Configurating

.env file contain rows 

```
  SYNC_INTERVAL - how often server will be update currency from api
  API_TOKEN - token from www.currencyconverterapi.com, received after email verification
```
<br/>

## convert currency

To convert money in specific currency, you should use route:


## Request

    GET /currency/history/{CURRENCY}/{DATE}?amount=.

    http://localhost:3000/currency/history/eur/2020-06-02/?amount=2
```
CURRENCY* - eur/usd
DATE* - yyyy-mm-dd
amount* - count of money to convert
```

#### response
```
59.98 
```
<br/>

## get latest currrency

## Request

    GET /currency/latest/{CURRENCY}.

    http://localhost:3000/currency/latest/usd
```
CURRENCY* - eur/usd
```

#### response
```
27.06 
```

all currenct data given from **www.currencyconverterapi.com**
