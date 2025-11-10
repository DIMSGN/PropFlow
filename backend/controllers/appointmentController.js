const { Appointment, Document, Client, Property, User } = require("../models");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}-${file.originalname}`);
  },
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs, and documents are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

exports.uploadDocument = [
  upload.single("document"),
  async (req, res) => {
    const { id } = req.params;
    const filename = req.file.filename;
    const documentPath = `uploads/${filename}`;

    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        // Delete uploaded file if appointment not found
        await fs.promises.unlink(path.join(__dirname, "../uploads", filename));
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Create document record in database
      const document = await Document.create({
        filename: filename,
        originalName: req.file.originalname,
        path: documentPath,
        appointmentId: id,
      });

      res.status(200).json({
        message: "Document uploaded successfully",
        document: document,
      });
    } catch (error) {
      // Clean up file on error
      if (req.file) {
        await fs.promises.unlink(
          path.join(__dirname, "../uploads", req.file.filename)
        );
      }
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  },
];

// Fetch document names for an appointment
exports.getDocumentNames = async (req, res) => {
  const { id } = req.params;

  try {
    const documents = await Document.findAll({
      where: { appointmentId: id },
    });

    const documentList = documents.map((doc) => ({
      name: doc.originalName,
      path: doc.path,
      id: doc.id,
    }));

    res.status(200).json(documentList);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch document names" });
  }
};

// Delete a document by name
exports.deleteDocument = async (req, res) => {
  const { id, documentName } = req.params;

  try {
    // Find the document in the database
    const document = await Document.findOne({
      where: {
        appointmentId: id,
        originalName: documentName,
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, "../uploads", document.filename);
    await fs.promises.unlink(filePath);

    // Delete the database record
    await document.destroy();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    status,
    notes,
    clientId,
    propertyId,
    assignedUserId,
  } = req.body;

  try {
    const appointment = await Appointment.create({
      title,
      description,
      startDate,
      endDate,
      status: status || "scheduled",
      notes,
      clientId,
      propertyId,
      assignedUserId,
    });

    // Fetch the complete appointment with relationships
    const appointmentWithRelations = await Appointment.findByPk(
      appointment.id,
      {
        include: [
          { model: Client, as: "client" },
          { model: Property, as: "property" },
          {
            model: User,
            as: "assignedAgent",
            attributes: { exclude: ["password_hash"] },
          },
        ],
      }
    );

    res.status(201).json(appointmentWithRelations);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, clientId, propertyId, assignedUserId, startDate, endDate } =
      req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (clientId) whereClause.clientId = clientId;
    if (propertyId) whereClause.propertyId = propertyId;
    if (assignedUserId) whereClause.assignedUserId = assignedUserId;
    if (startDate) whereClause.startDate = { [Op.gte]: new Date(startDate) };
    if (endDate) whereClause.endDate = { [Op.lte]: new Date(endDate) };

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Client, as: "client" },
        { model: Property, as: "property" },
        {
          model: User,
          as: "assignedAgent",
          attributes: { exclude: ["password_hash"] },
        },
        { model: Document, as: "documents" },
      ],
      order: [["startDate", "ASC"]],
    });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get a specific appointment by ID
exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Client, as: "client" },
        { model: Property, as: "property" },
        {
          model: User,
          as: "assignedAgent",
          attributes: { exclude: ["password_hash"] },
        },
        { model: Document, as: "documents" },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

// Update an appointment by ID
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    startDate,
    endDate,
    status,
    notes,
    clientId,
    propertyId,
    assignedUserId,
  } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await appointment.update({
      title,
      description,
      startDate,
      endDate,
      status,
      notes,
      clientId,
      propertyId,
      assignedUserId,
    });

    // Fetch updated appointment with relationships
    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        { model: Client, as: "client" },
        { model: Property, as: "property" },
        {
          model: User,
          as: "assignedAgent",
          attributes: { exclude: ["password_hash"] },
        },
      ],
    });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// Delete an appointment by ID
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await appointment.destroy();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
