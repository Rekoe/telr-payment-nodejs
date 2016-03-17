# TelrPayments-nodejs﻿

This nodejs module allows you to quickly and easily create orders and verify orders with [telr](http://telr.com/) using [nodejs](http://nodejs.org/).

```javascript
var telr = require("../lib/telr")("YOUR_AUTH_KEY", "YOUR_STORE_ID", {
    currency: "aed"
});

telr.order({
    orderId: 7383,
    amount: 4.5,
    returnUrl: "http://google.com",
    description: "Test description"
}, function(err, response){
    console.log(response);
});
```
