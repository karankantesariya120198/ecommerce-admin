const knex = require('../db/knex');

class User {
    static get tableName() {
        return 'users';
    }

    static async create(userData) {
        try {
            const [id] = await knex(this.tableName)
                .insert(userData);
            return { id, ...userData };
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const user = await knex(this.tableName)
                .where({ email, deleted_at: null })
                .first();
            return user;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    static async validateCredentials(email, password) {
        try {
            const user = await knex(this.tableName)
                .where({ email, password, deleted_at: null })
                .first();
            return user;
        } catch (error) {
            throw new Error(`Error validating credentials: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const user = await knex(this.tableName)
                .where({ id, deleted_at: null })
                .first();
            return user;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    static async update(id, updateData) {
        try {
            await knex(this.tableName)
                .where({ id, deleted_at: null })
                .update(updateData);
            const updatedUser = await this.findById(id);
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    static async softDelete(id) {
        try {
            const deletedAt = new Date();
            await knex(this.tableName).where({ id }).update({ deleted_at: deletedAt });
            return { id, deleted_at: deletedAt };
        } catch (error) {
            throw new Error(`Error soft deleting user: ${error.message}`);
        }
    }

    static async hardDelete(id) {
        try {
            await knex(this.tableName)
                .where({ id })
                .del();
            return { id };
        } catch (error) {
            throw new Error(`Error hard deleting user: ${error.message}`);
        }
    }

    static async findAll(limit = 100, offset = 0) {
        try {
            const users = await knex(this.tableName)
                .where({ deleted_at: null })
                .select('*')
                .limit(limit)
                .offset(offset)
                .orderBy('created_at', 'desc');
            return users;
        } catch (error) {
            throw new Error(`Error retrieving users: ${error.message}`);
        }
    }

    // Count total users
    static async count() {
        try {
            const result = await knex(this.tableName)
                .where({ deleted_at: null })
                .count('id as count')
                .first();
            
            return result.count;
        } catch (error) {
            throw new Error(`Error counting users: ${error.message}`);
        }
    }

    // Search users
    static async search(query, limit = 10, offset = 0) {
        try {
        return await knex(this.tableName)
            .where({ deleted_at: null })
            .andWhere(function() {
            this.where('email', 'like', `%${query}%`)
                .orWhere('nickname', 'like', `%${query}%`)
                .orWhere('phone', 'like', `%${query}%`);
            })
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy('created_at', 'desc');
        } catch (error) {
            throw new Error(`Error searching users: ${error.message}`);
        }
    }
}

module.exports = User;