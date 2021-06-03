import * as admin from 'firebase-admin';
admin.initializeApp();

exports.contact = require('./contact');
exports.editor = require('./editor');
exports.feedback = require('./feedback');
