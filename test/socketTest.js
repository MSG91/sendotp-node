'use strict';

const SendOtp = require('./../index');
const nock = require('nock');
const assert = require('assert');

describe('SendOtp', () => {
    it('create new instance', () => {
        let sendOtp = new SendOtp();
        assert(sendOtp instanceof SendOtp);
    });

    describe('constructor', () => {
        it('set default template if no message template is provided', () => {
            let sendOtp = new SendOtp('auth-key');
            assert.equal(sendOtp.authKey, 'auth-key');
            assert.equal(sendOtp.messageTemplate, 'Your otp is {{otp}}. Please do not share it with anybody');
        });
        it('message template is provided', () => {
            let sendOtp = new SendOtp('auth-key', 'new template to send otp');
            assert.equal(sendOtp.authKey, 'auth-key');
            assert.equal(sendOtp.messageTemplate, 'new template to send otp');
        });
    });

    describe('doRequest', () => {
        before(() => {
            this.nock = nock('https://control.msg91.com');
        });

        it('accepts any 2xx response', (done) => {
            let jsonResponse = {favorites: []};
            this.nock.get(/.*/).reply(201, jsonResponse);
            SendOtp.doRequest('get', 'sendotp.php', (error, data, response) => {
                assert.equal(error, null);
                assert.deepEqual(data, jsonResponse);
                assert.notEqual(response, null);
                done();
            });
        });

        it('errors when there is an error object', (done) => {
            let jsonResponse = {errors: ['nope']};
            this.nock.get(/.*/).reply(203, jsonResponse);
            SendOtp.doRequest('get', 'sendotp.php', (error, data, response) => {
                assert.deepEqual(error, ['nope']);
                assert.deepEqual(data, jsonResponse);
                assert.notEqual(response, null);
                done();
            });
        });
    });

});