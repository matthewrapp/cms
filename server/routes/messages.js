var express = require('express');
var router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');
const { max } = require('rxjs');
const contact = require('../models/contact');
const message = require('../models/message');

router.get('/', (req, res, next) => {
    Message.find()
        .populate('sender')
        .then(async messages => {
            return res.status(200).json({
                message: "Success!", 
                messages: messages
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error getting messages',
                error: err
            });
        })
});

router.post('/', async (req, res, next) => {
    const maxId = await sequenceGenerator.nextId('messages');

    const msg = new Message({
        id: maxId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.sender
    });

    msg.save()
        .then(async savedMsg => {
            return res.status(201).json({
                message: 'Message added successfully!',
                document: savedMsg
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'An error occured when saving the new message to the database.',
                error: err
            })
        });

    // const msg = new Message({
    //     id: maxId,
    //     subject: req.body.subject,
    //     msgText: req.body.msgText,
    //     sender: req.body.sender
    // });

    // msg.save()
    //     .then(async savedMsg => {
    //         let documentToSend = {};

    //         await Contact.findById({_id: savedMsg.sender}).then(contact => {
    //             documentToSend.contact = contact;
    //         });

    //         documentToSend.document = savedMsg;

    //         return res.status(201).json({
    //             message: 'Message added successfully!',
    //             document: documentToSend
    //         })
    //     })
    //     .catch(err => {
    //         return res.status(500).json({
    //             message: 'An error occured when saving the new message to the database.',
    //             error: err
    //         })
    //     });
});

router.put('/:id', (req, res, next) => {
    Message.findOne({id: req.params.id})
        .then(msg => {
            msg.subject = req.body.subject;
            msg.msgText = req.body.msgText;
            msg.sender = req.body.sender;

            Message.updateOne({ id: req.params.id}, msg)
                .then(result => {
                    return res.status(204).json({
                        message: 'Message updated successfully!',
                        result: result
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        message: 'An error occured when updating message',
                        error: err
                    })
                });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Message not found.',
                error: err
            })
        })
});

router.delete('/:id', (req, res, next) => {
    Message.findOne({id: req.params.id})
        .then(msg => {
            Message.deleteOne({id: req.params.id})
                .then(result => {
                    return res.status(204).json({
                        message: 'Message deleted successfully',
                        result: result
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        message: 'An error occured when deleting the message.',
                        error: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Message not found.',
                error: err
            })
        })
});

module.exports = router; 