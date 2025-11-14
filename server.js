// User Management REST API - Checkpoint Solution
// No MongoDB required - Uses JSON file as database

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Database file path
const DB_FILE = path.join(__dirname, 'users.json');

// Helper functions for database operations
const readUsers = async () => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Return empty array if file doesn't exist
        return [];
    }
};

const writeUsers = async (users) => {
    await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2));
};

// Generate unique ID
const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
};

// GET: RETURN ALL USERS
app.get('/users', async (req, res) => {
    try {
        console.log('GET /users - Fetching all users');
        const users = await readUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error in GET /users:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users',
            error: error.message
        });
    }
});

// POST: ADD A NEW USER TO THE DATABASE
app.post('/users', async (req, res) => {
    try {
        console.log('POST /users - Creating new user:', req.body);
        const { name, email, age, country } = req.body;

        // Validation: Check required fields
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required fields'
            });
        }

        const users = await readUsers();

        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Create new user object
        const newUser = {
            _id: generateId(),
            name,
            email,
            age: age || null,
            country: country || 'Unknown',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to database
        users.push(newUser);
        await writeUsers(users);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.error('Error in POST /users:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// PUT: EDIT A USER BY ID
app.put('/users/:id', async (req, res) => {
    try {
        console.log(`PUT /users/${req.params.id} - Updating user:`, req.body);
        const userId = req.params.id;
        const updateData = req.body;

        const users = await readUsers();

        // Find user index - FIXED: No Mongoose validation, just string comparison
        const userIndex = users.findIndex(user => user._id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await writeUsers(users);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: users[userIndex]
        });
    } catch (error) {
        console.error('Error in PUT /users:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

// DELETE: REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
    try {
        console.log(`DELETE /users/${req.params.id} - Deleting user`);
        const userId = req.params.id;

        const users = await readUsers();

        // Find user index - FIXED: No Mongoose validation
        const userIndex = users.findIndex(user => user._id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove user from array
        const deletedUser = users.splice(userIndex, 1)[0];
        await writeUsers(users);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        console.error('Error in DELETE /users:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'User Management REST API - Checkpoint Ready',
        endpoints: {
            'GET /users': 'Get all users',
            'POST /users': 'Create a new user',
            'PUT /users/:id': 'Update user by ID',
            'DELETE /users/:id': 'Delete user by ID'
        },
        database: 'JSON file (users.json) - No MongoDB required'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 User Management REST API Server Started!');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log('💾 Database: JSON file (no MongoDB installation needed)');
    console.log('✅ Ready for checkpoint testing with Thunder Client!');
});