const knex = require("../db/knex");

class Subcategories {
    static get tableName() {
        return 'subcategories';
    }

    static async create(createData) {
        try {
            const [id] = await knex(this.tableName)
                .insert(createData);
            return { id };
        } catch (error) {
            throw new Error(`Error creating subcategory: ${error.message}`);
        }
    }

    static async update(id, updateData) {
        try {
            await knex(this.tableName)
                .where({ id, deleted_at: null })
                .update(updateData);
            const updatedSubCategory = await this.findById(id);
            return updatedSubCategory;
        } catch (error) {
            throw new Error(`Error updating subcategory: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const subcategory = await knex(this.tableName)
                .join('categories', 'subcategories.category_id', 'categories.id')
                .where({ 'subcategories.id': id, 'subcategories.deleted_at': null })
                .first();
            return subcategory;
        } catch (error) {
            throw new Error(`Error finding subcategory by ID: ${error.message}`);
        }
    }

    static async softDelete(id) {
        try {
            const deletedAt = new Date();
            await knex(this.tableName)
                .where({ id, deleted_at: null })
                .update({ deleted_at: deletedAt });
            return { id, deleted_at: deletedAt };
        } catch (error) {
            throw new Error(`Error soft deleting subcategory: ${error.message}`);
        }
    }

    static async hardDelete(id) {
        try {
            await knex(this.tableName)
                .where({ id })
                .del();
            return { id };
        } catch (error) {
            throw new Error(`Error retrieving subcategories: ${error.message}`);
        }
    }

    static async findAll(userId, limit = 100, offset = 0) {
        try {
            const subcategories = await knex(this.tableName)
                .join('categories', 'subcategories.category_id', 'categories.id')
                .where({ 'subcategories.deleted_at': null, 'subcategories.user_id': userId })
                .select('subcategories.*', 'categories.name as category_name', 'categories.id as category_id')
                .limit(limit)
                .offset(offset)
                .orderBy('created_at', 'desc');
            return subcategories;
        } catch (error) {
            throw new Error(`Error retrieving subcategories: ${error.message}`);
        }
    }

    static async search(query, limit = 10, offset = 0) {
        try {
        return await knex(this.tableName)
            .join('categories', 'subcategories.category_id', 'categories.id')
            .where({ 'subcategories.deleted_at': null })
            .andWhere(function() {
            this.where('subcategories.name', 'like', `%${query}%`)
                .orWhere('subcategories.status', 'like', `%${query}%`)
                .orWhere('categories.name', 'like', `%${query}%`);
            })
            .select('subcategories.*, categories.name as category_name, categories.id as category_id')
            .limit(limit)
            .offset(offset)
            .orderBy('subcategories.created_at', 'desc');
        } catch (error) {
            throw new Error(`Error searching subcategories: ${error.message}`);
        }
    }
}

module.exports = Subcategories;