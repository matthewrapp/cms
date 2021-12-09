var express = require('express');
var router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

router.get('/', (req, res, next) => {
    Document.find()
        .then(documents => {
            return res.status(200).json({
                message: "Success!", 
                documents: documents
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error getting documents', 
                error: err
            });
        })
});

router.post('/', (req, res, next) => {
    const maxId = sequenceGenerator.nextId('documents');

    const doc = new Document({
        id: maxId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
    });

    doc.save()
        .then(createdDoc => {
            return res.status(201).json({
                message: 'Document added successfully!',
                document: createdDoc
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'An error occured when saving the new document to the database.',
                error: err
            })
        });
});

router.put('/:id', (req, res, next) => {
    Document.findOne({id: req.params.id})
        .then(doc => {
            doc.name = req.body.name;
            doc.description = req.body.description;
            doc.url = req.body.url;

            Document.updateOne({ id: req.params.id}, doc)
                .then(result => {
                    return res.status(204).json({
                        message: 'Document updated successfully!',
                        result: result
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        message: 'An error occured when updating document',
                        error: err
                    })
                });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Document not found.',
                error: err
            })
        })
});

router.delete('/:id', (req, res, next) => {
    Document.findOne({id: req.params.id})
        .then(doc => {
            Document.deleteOne({id: req.params.id})
                .then(result => {
                    return res.status(204).json({
                        message: 'Document deleted successfully.',
                        result: result
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        message: 'An error occured when deleting the document.',
                        error: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Document not found.',
                error: err
            })
        })
});

module.exports = router;