var express = require('express');
var router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');
const { max } = require('rxjs');

router.get('/', (req, res, next) => {
    Contact.find()
        .populate('group')
        .then(contacts => {
            return res.status(200).json({
                message: 'Contacts fetched successfully!',
                contacts: contacts
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'An error occured getting contacts.',
                error: err
            })
        })
});

// router.get('/:id', (req, res, next) => {
//     Contact.findOne({ id: req.params.id })
//         .populate('group')
//         .then(contact => {
//             return res.status(200).json({
//                 message: 'Contact fetched successfully!',
//                 contact: contact
//             })
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message: 'An error occured',
//                 error: err
//             })
//         })
// })

router.post('/', async (req, res, next) => {
    const maxId = await sequenceGenerator.nextId('contacts');

    const contact = new Contact({
        id: maxId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: req.body.group
    });


    contact.save()
        .then(createdContact => {
            return res.status(201).json({
                message: 'Contact added successfully!',
                contact: createdContact
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'An error occured when saving the new contact to the database.',
                error: err
            })
        });
});

router.put('/:id', (req, res, next) => {
    Contact.findOne({id: req.params.id})
        .then(contact => {
            contact.name = req.body.name;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            contact.imageUrl = req.body.imageUrl;
            contact.group = req.body.group;

            Contact.updateOne({ id: req.params.id}, contact)
                .then(result => {
                    return res.status(204).json({
                        message: 'Contact updated successfully!',
                        result: result
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        message: 'An error occured when updating contact',
                        error: err
                    })
                });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Contact not found.',
                error: err
            })
        })
});

router.delete('/:id', (req, res, next) => {
    Contact.findOne({id: req.params.id})
        .then(contact => {
            Contact.deleteOne({id: req.params.id})
                .then(result => {
                    return res.status(204).json({
                        message: 'Contact deleted successfully',
                        result: result
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        message: 'An error occured when deleting the contact.',
                        error: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Contact not found.',
                error: err
            })
        })
});

module.exports = router; 