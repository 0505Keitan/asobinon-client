import * as admin from 'firebase-admin';
admin.initializeApp();

exports.contact = require('./contact');
exports.uploader = require('./uploader');
exports.editor = require('./editor');
