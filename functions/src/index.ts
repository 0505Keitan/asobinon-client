import * as admin from 'firebase-admin';
admin.initializeApp();

exports.contact = require('./contact/index');
exports.uploader = require('./uploader');
