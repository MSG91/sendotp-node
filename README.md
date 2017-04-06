## SendOtp - Node.js SDK

This SDK enables sendOTP and allows you to send OTP

### Set-up:

1. Download the NPM module
```
npm install sendotp --save
```
2. Require the package in your code.
```
const SendOtp = require('sendotp');
```
3. Initialize with your auth key
```
const sendOtp = new SendOtp('AuthKey');
```
That's all, your SDK is set up!

### Requests

You now have the send, retry and verify otp via following methods.
```javascript
sendOtp.send(contactNumber, senderId, callback);
sendOtp.retry(contactNumber, retryVoice, callback);
sendOtp.verify(contactNumber, otp); // return boolean response
```

### Usage:

To send OTP
```javascript

sendOtp.send('919999999999', 'MSGIND')
    .on('success', (data) => {
        console.log('OTP Send');
    })
    .on('error', (err) => {
        console.warn(err);
    });
```

To retry OTP
```javascript
sendOtp.retry('919999999999', true)
    .on('success', (data) => {
        console.log('OTP Send again');
    })
    .on('error', (err) => {
        console.warn(err);
    });
```
**Note:** Set retryVoice false if you want to retry otp via text, default value is true

To verify OTP
```javascript
sendOtp.verify('919999999999', '9621' )
```

### Options:

By default sendotp uses default message template, but custom message template can also set in constructor like
```javascript
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey', 'Otp for your order is {{otp}}, please do not share it with anybody');
```

`{{otp}}` expression is used to inject generated otp in message.

### Licence:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

