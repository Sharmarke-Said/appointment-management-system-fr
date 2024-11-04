import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CCard, CCardBody, CCardHeader, CButton, CCol, CRow, CModal, CModalBody,
  CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CFormSelect,
  CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const Appointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    duration: 15,
    availability: 'availableNow',
    startDate: '',
    endDate: '',
    status: 'Pending',
    userId
  });

  useEffect(() => {
    fetchAppointments();
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter(appointment =>
        appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appointment.categoryId.name && appointment.categoryId.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(response.data);
      setFilteredAppointments(response.data); // Initialize filtered appointments
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories'); // Ensure the correct endpoint
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
    }
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
    resetForm();
    setIsEdit(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddAppointment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/appointments', form);
      setAppointments([...appointments, response.data]);
      toggleAddModal();
    } catch (error) {
      console.error('Error adding appointment:', error.response?.data || error.message);
    }
  };

  const handleEditAppointment = (appointment) => {
    setForm({ ...appointment });
    setShowAddModal(true);
    setIsEdit(true);
  };

  const handleUpdateAppointment = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/appointments/${form._id}`, form);
      const updatedAppointments = appointments.map(app =>
        app._id === form._id ? response.data : app
      );
      setAppointments(updatedAppointments);
      toggleAddModal();
    } catch (error) {
      console.error('Error updating appointment:', error.response?.data || error.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`);
      setAppointments(appointments.filter(app => app._id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      categoryId: '',
      duration: 15,
      availability: 'availableNow',
      startDate: '',
      endDate: '',
      status: 'Pending',
      userId
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Appointments</strong>
            <CButton color="primary" onClick={toggleAddModal} className="float-end me-2">
              <CIcon icon={cilPlus} /> Add Appointment
            </CButton>
          </CCardHeader>
          <CCardBody>
            {/* Search Input */}
            <CFormInput
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mb-3"
            />
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                  <CTableHeaderCell>Availability</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredAppointments.map((appointment, index) => (
                  <CTableRow key={appointment._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{appointment.title}</CTableDataCell>
                    <CTableDataCell>{appointment.categoryId.name}</CTableDataCell>
                    <CTableDataCell>{appointment.duration} mins</CTableDataCell>
                    <CTableDataCell>{appointment.availability}</CTableDataCell>
                    <CTableDataCell>{appointment.status}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" variant="outline" onClick={() => handleEditAppointment(appointment)} className="me-2">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" variant="outline" onClick={() => handleDeleteAppointment(appointment._id)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        <CModal visible={showAddModal} onClose={toggleAddModal}>
          <CModalHeader>
            <CModalTitle>{isEdit ? 'Edit' : 'Add'} Appointment</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                label="Title"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                required
                placeholder="Enter appointment title"
              />
              <CFormSelect
                label="Category"
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </CFormSelect>
              <CFormSelect
                label="Duration"
                name="duration"
                value={form.duration}
                onChange={handleInputChange}
                required
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="custom">Custom Duration</option>
              </CFormSelect>
              {form.duration === 'custom' && (
                <CFormInput
                  label="Custom Duration (in minutes)"
                  name="customDuration"
                  type="number"
                  onChange={handleInputChange}
                  placeholder="Enter custom duration"
                />
              )}
              <div className="mb-3">
                <label className="form-label">Availability:</label>
                <CFormCheck
                  type="radio"
                  id="availableNow"
                  name="availability"
                  value="availableNow"
                  checked={form.availability === 'availableNow'}
                  onChange={handleInputChange}
                  label="Available Now"
                />
                <CFormCheck
                  type="radio"
                  id="dateRange"
                  name="availability"
                  value="dateRange"
                  checked={form.availability === 'dateRange'}
                  onChange={handleInputChange}
                  label="Date Range"
                />
              </div>
              {form.availability === 'dateRange' && (
                <>
                  <CFormInput
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                  />
                  <CFormInput
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={toggleAddModal}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={isEdit ? handleUpdateAppointment : handleAddAppointment}>
              {isEdit ? 'Update' : 'Add'} Appointment
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  );
};

export default Appointments;
