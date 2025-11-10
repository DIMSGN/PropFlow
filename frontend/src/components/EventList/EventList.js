import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import API_BASE_URL from "../../config/api";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./EventList.css";

const useEventHandlers = (onEventUpdated) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});
  const [uploadingEventId, setUploadingEventId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [documentNames, setDocumentNames] = useState({});
  const [error, setError] = useState("");

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(API_ENDPOINTS.APPOINTMENT_BY_ID(id));
      onEventUpdated();
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event.");
    }
  };

  const handleDeleteDocument = async (eventId, documentName) => {
    try {
      await axios.delete(API_ENDPOINTS.DELETE_DOCUMENT(eventId, documentName));
      fetchDocumentNames(eventId);
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Failed to delete document.");
    }
  };

  const handleEditEvent = (event) => {
    setIsEditing(event.id);
    setEditedEvent({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(API_ENDPOINTS.APPOINTMENT_BY_ID(id), editedEvent);
      setIsEditing(null);
      setEditedEvent({});
      onEventUpdated();
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedEvent({});
  };

  const handleEditChange = (field, value) => {
    setEditedEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadDocument = async (id) => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      await axios.post(API_ENDPOINTS.UPLOAD_DOCUMENT(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadingEventId(null);
      setSelectedFile(null);
      onEventUpdated();
      fetchDocumentNames(id);
    } catch (error) {
      console.error("Error uploading document:", error);
      setError("Failed to upload document.");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleShowUploadForm = (id) => {
    setUploadingEventId(id);
  };

  const handleCancelUpload = () => {
    setUploadingEventId(null);
    setSelectedFile(null);
  };

  const handleToggleExpand = (id) => {
    setExpandedEventId(expandedEventId === id ? null : id);
    if (expandedEventId !== id) {
      fetchDocumentNames(id);
    }
  };

  const fetchDocumentNames = async (id) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DOCUMENTS(id));
      setDocumentNames((prev) => ({ ...prev, [id]: response.data }));
    } catch (error) {
      console.error("Error fetching document names:", error);
    }
  };

  return {
    isEditing,
    editedEvent,
    uploadingEventId,
    expandedEventId,
    documentNames,
    error,
    setError,
    handleDeleteEvent,
    handleEditEvent,
    handleSaveEdit,
    handleCancelEdit,
    handleEditChange,
    handleUploadDocument,
    handleFileChange,
    handleShowUploadForm,
    handleCancelUpload,
    handleToggleExpand,
    handleDeleteDocument,
  };
};

const EventList = ({ events, onEventUpdated }) => {
  const [orderBy, setOrderBy] = useState("startDate");
  const [order, setOrder] = useState("asc");

  const {
    isEditing,
    editedEvent,
    uploadingEventId,
    expandedEventId,
    documentNames,
    error,
    setError,
    handleDeleteEvent,
    handleEditEvent,
    handleSaveEdit,
    handleCancelEdit,
    handleEditChange,
    handleUploadDocument,
    handleFileChange,
    handleShowUploadForm,
    handleCancelUpload,
    handleToggleExpand,
    handleDeleteDocument,
  } = useEventHandlers(onEventUpdated);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    let aValue, bValue;

    if (orderBy === "client") {
      aValue = a.client
        ? `${a.client.first_name} ${a.client.last_name}`.toLowerCase()
        : "";
      bValue = b.client
        ? `${b.client.first_name} ${b.client.last_name}`.toLowerCase()
        : "";
    } else if (orderBy === "property") {
      aValue = a.property ? a.property.title.toLowerCase() : "";
      bValue = b.property ? b.property.title.toLowerCase() : "";
    } else if (orderBy === "agent") {
      aValue = a.assignedAgent ? a.assignedAgent.full_name.toLowerCase() : "";
      bValue = b.assignedAgent ? b.assignedAgent.full_name.toLowerCase() : "";
    } else if (orderBy === "startDate" || orderBy === "endDate") {
      aValue = new Date(a[orderBy]).getTime();
      bValue = new Date(b[orderBy]).getTime();
    } else {
      aValue = (a[orderBy] || "").toString().toLowerCase();
      bValue = (b[orderBy] || "").toString().toLowerCase();
    }

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const sortedEvents = stableSort(events, getComparator(order, orderBy));

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "title"}
                  direction={orderBy === "title" ? order : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "client"}
                  direction={orderBy === "client" ? order : "asc"}
                  onClick={() => handleRequestSort("client")}
                >
                  Client
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "property"}
                  direction={orderBy === "property" ? order : "asc"}
                  onClick={() => handleRequestSort("property")}
                >
                  Property
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "agent"}
                  direction={orderBy === "agent" ? order : "asc"}
                  onClick={() => handleRequestSort("agent")}
                >
                  Agent
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "startDate"}
                  direction={orderBy === "startDate" ? order : "asc"}
                  onClick={() => handleRequestSort("startDate")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "endDate"}
                  direction={orderBy === "endDate" ? order : "asc"}
                  onClick={() => handleRequestSort("endDate")}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEvents.map((event) => (
              <React.Fragment key={event.id}>
                <tr>
                  {isEditing === event.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editedEvent.title || ""}
                          onChange={(e) =>
                            handleEditChange("title", e.target.value)
                          }
                        />
                      </td>
                      <td colSpan="3">
                        <small className="text-muted">
                          Edit basic details only
                        </small>
                      </td>
                      <td>
                        <select
                          value={editedEvent.status || "scheduled"}
                          onChange={(e) =>
                            handleEditChange("status", e.target.value)
                          }
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          value={
                            editedEvent.startDate
                              ? new Date(editedEvent.startDate)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            handleEditChange("startDate", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          value={
                            editedEvent.endDate
                              ? new Date(editedEvent.endDate)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            handleEditChange("endDate", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <div className="button-group">
                          <button
                            onClick={() => handleSaveEdit(event.id)}
                            className="action-btn"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="action-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <strong>{event.title}</strong>
                      </td>
                      <td>
                        {event.client ? (
                          <span>
                            {event.client.first_name} {event.client.last_name}
                            <br />
                            <small className="text-muted">
                              {event.client.email}
                            </small>
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {event.property ? (
                          <span>
                            {event.property.title}
                            <br />
                            <small className="text-muted">
                              {event.property.city}
                            </small>
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {event.assignedAgent ? (
                          <span>{event.assignedAgent.full_name}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge status-${event.status}`}>
                          {event.status || "scheduled"}
                        </span>
                      </td>
                      <td>
                        <small>
                          {new Date(event.startDate).toLocaleDateString()}
                          <br />
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </td>
                      <td>
                        <small>
                          {new Date(event.endDate).toLocaleDateString()}
                          <br />
                          {new Date(event.endDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </td>
                      <td>
                        <div className="button-group">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="action-btn"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="action-btn btn-danger"
                            title="Delete"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleShowUploadForm(event.id)}
                            className="action-btn"
                            title="Upload Document"
                          >
                            <i className="fas fa-paperclip"></i>
                          </button>
                          <button
                            onClick={() => handleToggleExpand(event.id)}
                            className="action-btn"
                            title="View Documents"
                          >
                            <VisibilityIcon />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
                {expandedEventId === event.id && (
                  <tr>
                    <td colSpan="8">
                      <div className="document-list">
                        <h4>Documents & Details</h4>
                        {event.description && (
                          <div className="detail-section">
                            <strong>Description:</strong>
                            <p>{event.description}</p>
                          </div>
                        )}
                        {event.notes && (
                          <div className="detail-section">
                            <strong>Notes:</strong>
                            <p>{event.notes}</p>
                          </div>
                        )}
                        <div className="detail-section">
                          <strong>Attached Documents:</strong>
                          {documentNames[event.id] &&
                          documentNames[event.id].length > 0 ? (
                            documentNames[event.id].map((doc, index) => (
                              <div key={index} className="document-item">
                                <a
                                  href={`${API_BASE_URL}/${doc.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="document-link"
                                >
                                  {doc.name}
                                </a>
                                <button
                                  onClick={() =>
                                    handleDeleteDocument(event.id, doc.name)
                                  }
                                  className="delete-btn"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            ))
                          ) : (
                            <p>No documents uploaded.</p>
                          )}
                          {uploadingEventId === event.id && (
                            <div className="upload-form">
                              <input type="file" onChange={handleFileChange} />
                              <button
                                onClick={() => handleUploadDocument(event.id)}
                                className="action-btn"
                              >
                                Upload
                              </button>
                              <button
                                onClick={handleCancelUpload}
                                className="action-btn"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEventUpdated: PropTypes.func.isRequired,
};

export default EventList;
