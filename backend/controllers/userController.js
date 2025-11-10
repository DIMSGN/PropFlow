const { User, Appointment, Document } = require("../models");
const bcrypt = require("bcryptjs");

// Get all users (excluding password hash)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, is_active } = req.query;
    const whereClause = {};

    if (role) {
      whereClause.role = role;
    }

    if (is_active !== undefined) {
      whereClause.is_active = is_active === "true";
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password_hash"] },
      include: [
        {
          model: Appointment,
          as: "appointments",
          attributes: ["id", "title", "startDate", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
      include: [
        {
          model: Appointment,
          as: "appointments",
          include: ["client", "property"],
        },
        {
          model: Document,
          as: "uploadedDocuments",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password, role, is_active } = req.body;

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash,
      role: role || "agent",
      is_active: is_active !== undefined ? is_active : true,
    });

    // Return user without password hash
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, role, is_active } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {
      full_name,
      email,
      role,
      is_active,
    };

    // Only update password if provided
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    // Return user without password hash
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return user without password hash
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.json({
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
