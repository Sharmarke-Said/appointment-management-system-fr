import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryColor, setCategoryColor] = useState('#ffffff');

    const categoriesPerPage = 10;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter((category) =>
            category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * categoriesPerPage,
        currentPage * categoriesPerPage,
    );

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handlePageChange = (page) => setCurrentPage(page);

    const toggleAddModal = () => {
        setShowAddModal(!showAddModal);
        resetForm();
    };

    const toggleEditModal = (category) => {
        setSelectedCategory(category);
        if (category) {
            setCategoryName(category.name);
            setCategoryDescription(category.description);
            setCategoryColor(category.color);
        }
        setShowEditModal(!showEditModal);
    };

    const toggleDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(!showDeleteModal);
    };

    const handleAddCategory = async () => {
        try {
            const newCategory = { name: categoryName, description: categoryDescription, color: categoryColor };
            const response = await axios.post('http://localhost:5000/api/categories', newCategory);
            setCategories((prevCategories) => [...prevCategories, response.data.data.category]);
            resetForm();
            setShowAddModal(false); // Close modal after adding
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async () => {
        try {
            const updatedCategory = { name: categoryName, description: categoryDescription, color: categoryColor };
            const response = await axios.put(`http://localhost:5000/api/categories/${selectedCategory._id}`, updatedCategory);
            setCategories(categories.map(cat => cat._id === selectedCategory._id ? response.data.data.category : cat));
            resetForm();
            setShowEditModal(false); // Close modal after editing
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${selectedCategory._id}`);
            setCategories(categories.filter(cat => cat._id !== selectedCategory._id));
            setShowDeleteModal(false); // Close modal after deletion
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const resetForm = () => {
        setCategoryName('');
        setCategoryDescription('');
        setCategoryColor('#ffffff');
        setSelectedCategory(null);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Categories</strong>
                        <CButton color="primary" onClick={toggleAddModal} className="float-end">
                            <CIcon icon={cilPlus} /> Add Category
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="mb-3">
                            <CFormInput
                                type="text"
                                placeholder="Search by category name"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </CForm>
                        <CTable hover responsive align="middle">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>#</CTableHeaderCell>
                                    <CTableHeaderCell>Category</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentCategories.map((category, index) => (
                                    <CTableRow key={category._id}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell style={{ backgroundColor: category.color, color: '#fff', padding: '10px' }}>
                                            <div>
                                                <strong>{category.name}</strong>
                                            </div>
                                            <div>{category.description}</div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CButton
                                                color="info"
                                                variant="outline"
                                                onClick={() => toggleEditModal(category)}
                                                className="me-2"
                                            >
                                                <CIcon icon={cilPencil} />
                                            </CButton>
                                            <CButton
                                                color="danger"
                                                variant="outline"
                                                onClick={() => toggleDeleteModal(category)}
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

                {/* Add/Edit Category Modal */}
                <CModal visible={showAddModal || showEditModal} onClose={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                    <CModalHeader>
                        <CModalTitle>{showEditModal ? 'Edit Category' : 'Add Category'}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            {/* Name Field */}
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                <CFormInput
                                    id="categoryName"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            {/* Description Field */}
                            <div className="mb-3">
                                <label htmlFor="categoryDescription" className="form-label">Description</label>
                                <CFormInput
                                    id="categoryDescription"
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                />
                            </div>
                            {/* Color Picker Field */}
                            <div className="mb-3">
                                <label htmlFor="categoryColor" className="form-label">Color</label>
                                <CFormInput
                                    type="color"
                                    id="categoryColor"
                                    value={categoryColor}
                                    onChange={(e) => setCategoryColor(e.target.value)}
                                />
                            </div>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={showEditModal ? handleEditCategory : handleAddCategory}>
                            {showEditModal ? 'Update' : 'Add'} Category
                        </CButton>
                        <CButton color="secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>

                {/* Delete Category Confirmation Modal */}
                <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <CModalHeader>
                        <CModalTitle>Delete Confirmation</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        Are you sure you want to delete this category?
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="danger" onClick={handleDeleteCategory}>
                            Delete
                        </CButton>
                        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CCol>
        </CRow>
    );
};

export default Categories;
