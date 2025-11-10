const { Client, Appointment, Document, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get all clients with optional filtering
exports.getAllClients = async (req, res) => {
  try {
    const { nationality, search } = req.query;
    const whereClause = {};

    if (nationality) {
      whereClause.nationality = nationality;
    }

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { passport_number: { [Op.like]: `%${search}%` } },
      ];
    }

    const clients = await Client.findAll({
      where: whereClause,
      include: [
        {
          model: Appointment,
          as: "appointments",
          attributes: ["id", "title", "startDate", "status"],
        },
        {
          model: Document,
          as: "documents",
          attributes: ["id", "originalName", "type", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// Get single client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [
        {
          model: Appointment,
          as: "appointments",
          include: ["property", "assignedAgent"],
        },
        {
          model: Document,
          as: "documents",
          include: ["uploader"],
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      nationality,
      passport_number,
    } = req.body;

    const client = await Client.create({
      first_name,
      last_name,
      email,
      phone,
      nationality,
      passport_number,
    });

    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Client with this email or passport number already exists",
      });
    }
    res.status(500).json({ error: "Failed to create client" });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      nationality,
      passport_number,
    } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    await client.update({
      first_name,
      last_name,
      email,
      phone,
      nationality,
      passport_number,
    });

    res.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Client with this email or passport number already exists",
      });
    }
    res.status(500).json({ error: "Failed to update client" });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    await client.destroy();

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Failed to delete client" });
  }
};

// Get client statistics
exports.getClientStats = async (req, res) => {
  try {
    const totalClients = await Client.count();
    const clientsByNationality = await Client.findAll({
      attributes: [
        "nationality",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["nationality"],
    });

    res.json({
      total: totalClients,
      byNationality: clientsByNationality,
    });
  } catch (error) {
    console.error("Error fetching client stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};
