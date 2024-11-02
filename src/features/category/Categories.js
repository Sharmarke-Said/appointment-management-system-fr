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

    // State for new/edit category inputs
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryColor, setCategoryColor] = useState('#ffffff');

    const categoriesPerPage = 5;

    // Fetch categories from API
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

    // Toggle modals
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

    // Form reset
    const resetForm = () => {
        setCategoryName('');
        setCategoryDescription('');
        setCategoryColor('#ffffff');
    };

    // CRUD operations
    const handleAddCategory = async () => {
        try {
            const newCategory = { name: categoryName, description: categoryDescription, color: categoryColor };
            const response = await axios.post('http://localhost:5000/api/categories', newCategory);
            setCategories([...categories, response.data.data]);
            toggleAddModal();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async () => {

        try {
            const updatedCategory = { name: categoryName, description: categoryDescription, color: categoryColor };
            const response = await axios.put(`http://localhost:5000/api/categories/${selectedCategory._id}`, updatedCategory);
            setCategories(categories.map(cat => cat._id === selectedCategory._id ? response.data.data : cat));
            toggleEditModal(null);
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${selectedCategory._id}`);
            setCategories(categories.filter(cat => cat._id !== selectedCategory._id));
            toggleDeleteModal(null);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
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
                                    <CTableHeaderCell>Category Name</CTableHeaderCell>
                                    <CTableHeaderCell>Description</CTableHeaderCell>
                                    <CTableHeaderCell>Color</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentCategories.map((category, index) => (
                                    <CTableRow key={category._id}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>{category.name}</CTableDataCell>
                                        <CTableDataCell>{category.description}</CTableDataCell>
                                        <CTableDataCell>
                                            <span style={{ backgroundColor: category.color }}>{category.color}</span>
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
                <CModal visible={showAddModal || showEditModal} onClose={toggleAddModal}>
                    <CModalHeader>
                        <CModalTitle>{showEditModal ? 'Edit Category' : 'Add Category'}</CModalTitle>
                        <CButton variant="outline" color="secondary" onClick={toggleAddModal}>
                            Close
                        </CButton>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CFormInput
                                label="Name"
                                placeholder="Enter category name"
                                className="mb-3"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                            <CFormInput
                                label="Description"
                                placeholder="Enter description"
                                className="mb-3"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                            />
                            <CFormInput
                                label="Color"
                                type="color"
                                className="mb-3"
                                value={categoryColor}
                                onChange={(e) => setCategoryColor(e.target.value)}
                            />
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={toggleAddModal}>
                            Close
                        </CButton>
                        <CButton color="primary" onClick={showEditModal ? handleEditCategory : handleAddCategory}>
                            {showEditModal ? 'Update Category' : 'Add Category'}
                        </CButton>
                    </CModalFooter>
                </CModal>

                {/* Delete Category Modal */}
                <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <CModalHeader>
                        <CModalTitle>Delete Category</CModalTitle>
                        <CButton variant="outline" color="danger" onClick={() => setShowDeleteModal(false)} className="btn-close" aria-label="Close" />
                    </CModalHeader>
                    <CModalBody>Are you sure you want to delete this category?</CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </CButton>
                        <CButton color="danger" onClick={handleDeleteCategory}>
                            Delete
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CCol>
        </CRow>
    );
};

export default Categories;
