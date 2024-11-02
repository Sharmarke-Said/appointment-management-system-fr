import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CPagination,
  CPaginationItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const appointmentsPerPage = 5

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments')
        setAppointments(response.data.data.appointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }
    fetchAppointments()
  }, [])

  useEffect(() => {
    const filtered = appointments.filter((appointment) =>
      appointment.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredAppointments(filtered)
  }, [searchTerm, appointments])

  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage)
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage,
  )

  const handleSearch = (e) => setSearchTerm(e.target.value)
  const handlePageChange = (page) => setCurrentPage(page)

  const toggleAddModal = () => setShowAddModal(!showAddModal)
  const toggleEditModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowEditModal(!showEditModal)
  }
  const toggleDeleteModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDeleteModal(!showDeleteModal)
  }

  const handleAddAppointment = () => {
    // Add logic here
  }
  const handleEditAppointment = () => {
    // Edit logic here
  }
  const handleDeleteAppointment = () => {
    // Delete logic here
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Appointments</strong>
            <CButton color="primary" onClick={toggleAddModal} className="float-end">
              <CIcon icon={cilPlus} /> Add Appointment
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CForm className="mb-3">
              <CFormInput
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </CForm>
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Time</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentAppointments.map((appointment, index) => (
                  <CTableRow key={appointment._id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{appointment.userId.fullName}</CTableDataCell>
                    <CTableDataCell>{appointment.date}</CTableDataCell>
                    <CTableDataCell>{appointment.time}</CTableDataCell>
                    <CTableDataCell>{appointment.categoryId.name}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        variant="outline"
                        onClick={() => toggleEditModal(appointment)}
                        className="me-2"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        onClick={() => toggleDeleteModal(appointment)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" className="mt-3">
              {[...Array(totalPages).keys()].map((page) => (
                <CPaginationItem
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </CCardBody>
        </CCard>

        {/* Add Appointment Modal */}
        <CModal visible={showAddModal} onClose={toggleAddModal}>
          <CModalHeader>
            <CModalTitle>Add Appointment</CModalTitle>
            <CButton variant="close" onClick={toggleAddModal} />
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput label="Name" placeholder="Enter full name" className="mb-3" />
              <CFormInput label="Date" type="date" className="mb-3" />
              <CFormInput label="Time" type="time" className="mb-3" />
              <CFormInput label="Status" placeholder="Enter status" className="mb-3" />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={toggleAddModal}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleAddAppointment}>
              Add Appointment
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Edit Appointment Modal */}
        <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
          <CModalHeader>
            <CModalTitle>Edit Appointment</CModalTitle>
            <CButton variant="close" onClick={() => setShowEditModal(false)} />
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                label="Name"
                defaultValue={selectedAppointment?.userId.fullName}
                className="mb-3"
              />
              <CFormInput
                label="Date"
                type="date"
                defaultValue={selectedAppointment?.date}
                className="mb-3"
              />
              <CFormInput
                label="Time"
                type="time"
                defaultValue={selectedAppointment?.time}
                className="mb-3"
              />
              <CFormInput
                label="Status"
                defaultValue={selectedAppointment?.categoryId.name}
                className="mb-3"
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleEditAppointment}>
              Update Appointment
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Delete Appointment Modal */}
        <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <CModalHeader>
            <CModalTitle>Delete Appointment</CModalTitle>
            <CButton variant="close" onClick={() => setShowDeleteModal(false)} />
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this appointment?</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </CButton>
            <CButton color="danger" onClick={handleDeleteAppointment}>
              Delete
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default Appointments
