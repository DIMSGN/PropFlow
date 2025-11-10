const { Property, Appointment, Client, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get all properties with optional filtering
exports.getAllProperties = async (req, res) => {
  try {
    const { city, status, minPrice, maxPrice } = req.query;
    const whereClause = {};

    if (city) {
      whereClause.city = city;
    }

    if (status) {
      whereClause.status = status;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    const properties = await Property.findAll({
      where: whereClause,
      include: [
        {
          model: Appointment,
          as: "appointments",
          attributes: ["id", "title", "startDate", "status"],
        },
        {
          model: Client,
          as: "client",
          attributes: ["id", "first_name", "last_name", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Get single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        {
          model: Appointment,
          as: "appointments",
          include: ["client", "assignedAgent"],
        },
        {
          model: Client,
          as: "client",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "nationality",
          ],
        },
      ],
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
};

// Create new property
exports.createProperty = async (req, res) => {
  try {
    const { title, address, city, price, description, status, clientId } =
      req.body;

    const property = await Property.create({
      title,
      address,
      city,
      price,
      description,
      status: status || "available",
      clientId: clientId || null,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, address, city, price, description, status, clientId } =
      req.body;

    console.log("Updating property:", id, "with data:", req.body);

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // If status is changing to available, clear clientId
    // Otherwise use the provided clientId (which could be null)
    const updatedClientId = status === "available" ? null : clientId || null;

    console.log("Setting clientId to:", updatedClientId);

    await property.update({
      title,
      address,
      city,
      price,
      description,
      status,
      clientId: updatedClientId,
    });

    // Fetch updated property with client info
    const updatedProperty = await Property.findByPk(id, {
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });

    console.log("Updated property with client:", updatedProperty.toJSON());

    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.destroy();

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
};

// Get property statistics
exports.getPropertyStats = async (req, res) => {
  try {
    const totalProperties = await Property.count();
    const propertiesByStatus = await Property.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });
    const propertiesByCity = await Property.findAll({
      attributes: [
        "city",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["city"],
    });

    res.json({
      total: totalProperties,
      byStatus: propertiesByStatus,
      byCity: propertiesByCity,
    });
  } catch (error) {
    console.error("Error fetching property stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};
