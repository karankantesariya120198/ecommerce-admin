const knex = require("../db/knex");

class Categories {
    static get tableName() {
        return 'categories';
    }

    static async create(createData) {
        try {
            const [id] = await knex(this.tableName)
                .insert(createData);
            return { id };
        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    }

    static async update(id, updateData) {
        try {
            await knex(this.tableName)
                .where({ id, deleted_at: null })
                .update(updateData);
            const updatedCategory = await this.findById(id);
            return updatedCategory;
        } catch (error) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const category = await knex(this.tableName)
                .where({ id, deleted_at: null })
                .first();
            return category;
        } catch (error) {
            throw new Error(`Error finding category by ID: ${error.message}`);
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
            throw new Error(`Error soft deleting category: ${error.message}`);
        }
    }

    static async hardDelete(id) {
        try {
            await knex(this.tableName)
                .where({ id })
                .del();
            return { id };
        } catch (error) {
            throw new Error(`Error retrieving categories: ${error.message}`);
        }
    }

    static async findAll(userId, limit = 100, offset = 0) {
        try {
            const categories = await knex(this.tableName)
                .where({ deleted_at: null, user_id: userId })
                .select('*')
                .limit(limit)
                .offset(offset)
                .orderBy('created_at', 'desc');
            return categories;
        } catch (error) {
            throw new Error(`Error retrieving categories: ${error.message}`);
        }
    }

    static async search(query, limit = 10, offset = 0) {
        try {
        return await knex(this.tableName)
            .where({ deleted_at: null })
            .andWhere(function() {
            this.where('name', 'like', `%${query}%`)
                .orWhere('slug', 'like', `%${query}%`)
                .orWhere('quantity', 'like', `%${query}%`)
                .orWhere('status', 'like', `%${query}%`);
            })
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy('created_at', 'desc');
        } catch (error) {
            throw new Error(`Error searching categories: ${error.message}`);
        }
    }
}

module.exports = Categories;