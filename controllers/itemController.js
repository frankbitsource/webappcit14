const ItemModel = require('../models/itemModel');

class ItemController {
    static async getAllItems(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const items = await ItemModel.getAll(page, limit);
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async searchItems(req, res) {
        try {
            const { name, startDate, endDate } = req.query;
            const items = await ItemModel.search(name, startDate, endDate);
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async createItem(req, res) {
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }
            const item = await ItemModel.create(name, description);
            res.status(201).json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateItem(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }
            const item = await ItemModel.update(id, name, description);
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async partialUpdateItem(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const item = await ItemModel.partialUpdate(id, updates);
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteItem(req, res) {
        try {
            const { id } = req.params;
            await ItemModel.delete(id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ItemController; 