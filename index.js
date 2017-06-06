"use strict";

let request = require('request');

class SendOtp {

    /**
     * Creates a new SendOtp instance
     * @param {string} authKey Authentication key
     * @param {string, optional} messageTemplate
     */
    constructor(authKey, messageTemplate) {
        this.authKey = authKey;
        if(messageTemplate){
            this.messageTemplate = messageTemplate;
        }else{
            this.messageTemplate = "Your otp is {{otp}}. Please do not share it with anybody";
        }
        this.otp_expiry = 1440; //1 Day =1440 minutes
    }

    /**
     * Returns the base URL for MSG91 api call
     * @returns {string} Base URL for MSG91 api call
     */
    static getBaseURL() {
        return "https://control.msg91.com/api/";
    }

    /**
     * Set the OTP expiry minutes for MSG91 api call
     */
    setOtpExpiry(otp_expiry) {
        this.otp_expiry=otp_expiry;
        return;
    }

    /**
     * Returns the 4 digit otp
     * @returns {integer} 4 digit otp
     */
    static generateOtp() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    /**
     * Send Otp to given mobile number
     * @param {string} contactNumber receiver's mobile number along with country code
     * @param {string} senderId
     * @param {string, optional} otp
     * Return promise if no callback is passed and promises available
     */
    send(contactNumber, senderId, otp, callback) {
        if (typeof otp === 'function') {
            callback = otp;
            otp = SendOtp.generateOtp()
        }
        let args = {
                authkey: this.authKey,
                mobile: contactNumber,
                sender: senderId,
                message: this.messageTemplate.replace('{{otp}}', otp),
                otp: otp,
                otp_expiry: this.otp_expiry
            };
        return SendOtp.doRequest('get', "sendotp.php", args, callback);
    }

    /**
     * Retry Otp to given mobile number
     * @param {string} contactNumber receiver's mobile number along with country code
     * @param {boolean} retryVoice, false to retry otp via text call, default true
     * Return promise if no callback is passed and promises available
     */
    retry(contactNumber, retryVoice, callback) {
        let retryType =  'voice';
        if (!retryVoice) {
            retryType = 'text'
        }
        let args = {
            authkey: this.authKey,
            mobile: contactNumber,
            retrytype: retryType
        };

        return SendOtp.doRequest('get', "retryotp.php", args, callback);
    }

    /**
     * Verify Otp to given mobile number
     * @param {string} contactNumber receiver's mobile number along with country code
     * @param {string} otp otp to verify
     * Return promise if no callback is passed and promises available
     */
    verify(contactNumber, otp, callback) {
        let args = {
                authkey: this.authKey,
                mobile: contactNumber,
                otp: otp
            };
        return SendOtp.doRequest('get', "verifyRequestOTP.php", args, callback);
    }

    static doRequest (method, path, params, callback) {
        let promise = false;

        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        // Return promise if no callback is passed and promises available
        else if (callback === undefined && this.allow_promise) {
            promise = true;
        }

        let options = {
            method: method,
            url: SendOtp.getBaseURL() + "" + path
        };

        if (method === 'get') {
            options.qs = params;
        }

        // Pass form data if post
        if (method === 'post') {
            let formKey = 'form';

            if (typeof params.media !== 'undefined') {
                formKey = 'formData';
            }
            options[formKey] = params;
        }
        // Promisified version
        if (promise) {
            return new Promise(function (resolve, reject) {
                request(options, function (error, response, data) {
                    // request error
                    if (error) {
                        return reject(error);
                    }

                    // JSON parse error or empty strings
                    try {
                        // An empty string is a valid response
                        if (data === '') {
                            data = {};
                        }
                        else {
                            data = JSON.parse(data);
                        }
                    }
                    catch (parseError) {
                        return reject(new Error('JSON parseError with HTTP Status: ' + response.statusCode + ' ' + response.statusMessage));
                    }

                    // response object errors
                    // This should return an error object not an array of errors
                    if (data.errors !== undefined) {
                        return reject(data.errors);
                    }

                    // status code errors
                    if (response.statusCode < 200 || response.statusCode > 299) {
                        return reject(new Error('HTTP Error: ' + response.statusCode + ' ' + response.statusMessage));
                    }

                    // no errors
                    resolve(data);
                });
            });
        }

        request(options, function(error, response, data) {
            // request error
            if (error) {
                return callback(error, data, response);
            }

            // JSON parse error or empty strings
            try {
                // An empty string is a valid response
                if (data === '') {
                    data = {};
                }
                else {
                    data = JSON.parse(data);
                }
            }
            catch(parseError) {
                return callback(
                    new Error('JSON parseError with HTTP Status: ' + response.statusCode + ' ' + response.statusMessage),
                    data,
                    response
                );
            }


            // response object errors
            // This should return an error object not an array of errors
            if (data.errors !== undefined) {
                return callback(data.errors, data, response);
            }

            // status code errors
            if(response.statusCode < 200 || response.statusCode > 299) {
                return callback(
                    new Error('HTTP Error: ' + response.statusCode + ' ' + response.statusMessage),
                    data,
                    response
                );
            }
            // no errors
            callback(null, data, response);
        });

    };

}

module.exports = SendOtp;
