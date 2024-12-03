const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');

router.get('/', ItemController.getAllItems);
router.get('/search', ItemController.searchItems);
router.post('/', ItemController.createItem);
router.put('/:id', ItemController.updateItem);
router.patch('/:id', ItemController.partialUpdateItem);
router.delete('/:id', ItemController.deleteItem);

module.exports = router; 