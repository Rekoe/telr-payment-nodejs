"use strict";

var config = require("../config/config.json");
var request = require("request");

var Telr = function(authKey, storeId, options) {

    if(typeof authKey === "string"){
        this.authKey = authKey;
    }else{
        throw new Error("Valid Authentication key is required.");
    }

    if(typeof storeId === "string"){
        this.storeId = storeId;
    }else{
        throw new Error("Valid StoreId key is required.");
    }

    this.options  = options || {};
    this.defaultCurrency = options.currency || config.defaultCurrency;
    this.isTest = (options.isTest === undefined ? ((process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") ? 1 : 2) : (options.isTest ? 1 : 2));

    var _this = this;

    var order = function(options, callback){

        options.customer = options.customer || {};

        var postData = {
            ivp_method: "create",
            ivp_currency: options.currency || _this.defaultCurrency,
            ivp_test: _this.isTest,
            ivp_authkey: _this.authKey,
            ivp_store: _this.storeId
        };

        if(options === undefined || typeof options !== "object") throw new Error("Valid options are required.");
        if(options.orderId === undefined) throw new Error("Unique orderId is not provided.");
        if(options.amount === undefined) throw new Error("amount is not provided.");
        if(options.returnUrl === undefined) throw new Error("returnUrl is not provided.");
        if(options.description === undefined) throw new Error("description is not provided.");

        postData.ivp_cart = options.orderId;
        postData.return_auth = options.returnUrl;
        postData.return_decl = options.declineUrl || options.returnUrl;
        postData.return_can = options.cancelUrl || options.returnUrl;
        postData.ivp_desc = options.description;
        postData.ivp_amount = options.amount;
        postData.bill_fname = options.customer.firstName || null;
        postData.bill_sname = options.customer.lastName || null;
        postData.bill_addr1 = options.customer.address || null;
        postData.bill_city = options.customer.city || null;
        postData.bill_country = options.customer.country || null;
        postData.bill_email = options.customer.email || null;
        
        request.post({
            url: config.url + config.api.order,
            form: postData
        }, function(err, resp, body){
            callback(err, body);
        });
    };


    var status = function(orderReference, callback){

        if(orderReference === undefined) throw new Error("orderReference is not provided.");

        var postData = {
            ivp_method: "check",
            order_ref: orderReference,
            ivp_test: _this.isTest,
            ivp_authkey: _this.authKey,
            ivp_store: _this.storeId
        };

        request.post({
            url: config.url + config.api.order,
            form: postData
        }, function(err, resp, body){
            callback(err, body);
        });

    };

    this.order = order;
    this.status = status;
    this.options = this.options;
    this.config = config;
    return this;
}

module.exports = function(authKey, storeId, options){
    return new Telr(authKey, storeId, options);
};
