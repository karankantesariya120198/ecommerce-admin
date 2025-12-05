const knex = require("../db/knex");

class Files {
    static get tableName() {
        return 'files';
    }

    static async create(fileData) {
        try {
            const [id] = await knex(this.tableName)
                .insert(fileData);
            return { id };
        } catch (error) {
            throw new Error(`Error creating file record: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const file = await knex(this.tableName)
                .where({ id, deleted_at: null })
                .first();
            return file;
        } catch (error) {
            throw new Error(`Error finding file by ID: ${error.message}`);
        }
    }

    static async softDelete(id) {
        try {
            const deletedAt = new Date().toISOString();
            await knex(this.tableName)
                .where({ id, deleted_at: null })
                .update({ deleted_at: deletedAt });
            return { id, deleted_at: deletedAt };
        } catch (error) {
            throw new Error(`Error soft deleting file: ${error.message}`);
        }
    }

    static async hardDelete(id) {
        try {
            await knex(this.tableName)
                .where({ id })
                .del();
            return { id };
        } catch (error) {
            throw new Error(`Error hard deleting file: ${error.message}`);
        }
    }
}

module.exports = Files;