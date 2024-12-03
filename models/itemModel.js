const { db } = require('../database');

class ItemModel {
    static getAll(page, limit) {
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM items ORDER BY date_created DESC LIMIT ? OFFSET ?',
                [limit, offset],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    static search(name, startDate, endDate) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM items WHERE 1=1';
            const params = [];

            if (name) {
                query += ' AND name LIKE ?';
                params.push(`%${name}%`);
            }

            if (startDate) {
                query += ' AND date_created >= ?';
                params.push(startDate);
            }

            if (endDate) {
                query += ' AND date_created <= ?';
                params.push(endDate);
            }

            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static create(name, description) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO items (name, description) VALUES (?, ?)',
                [name, description],
                function(err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, name, description });
                }
            );
        });
    }

    static update(id, name, description) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE items SET name = ?, description = ? WHERE id = ?',
                [name, description, id],
                (err) => {
                    if (err) reject(err);
                    resolve({ id, name, description });
                }
            );
        });
    }

    static partialUpdate(id, updates) {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(updates);
            const values = Object.values(updates);
            
            const setClause = keys.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE items SET ${setClause} WHERE id = ?`;
            
            db.run(query, [...values, id], (err) => {
                if (err) reject(err);
                resolve({ id, ...updates });
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = ItemModel; 