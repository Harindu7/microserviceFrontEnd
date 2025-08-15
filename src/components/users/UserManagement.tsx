import { useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { User, UserDTO } from '../../types';
import { UserService } from '../../services/userService';
import { CompanyService } from '../../services/companyService';
import type { Company } from '../../types';

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserDTO>({
        firstName: '',
        lastName: '',
        email: '',
        companyId: '',
        phoneNumber: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, companiesData] = await Promise.all([
                UserService.getAll(),
                CompanyService.getAll()
            ]);
            setUsers(usersData);
            setCompanies(companiesData);
        } catch (error) {
            toast.error('Failed to load data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedUser) {
                await UserService.update(selectedUser.id, formData);
                toast.success('User updated successfully');
            } else {
                await UserService.create(formData);
                toast.success('User created successfully');
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            toast.error('Operation failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (userId: string) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        
        setLoading(true);
        try {
            await UserService.deactivate(userId);
            toast.success('User deactivated successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to deactivate user');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                companyId: user.companyId,
                phoneNumber: user.phoneNumber
            });
        } else {
            setSelectedUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                companyId: '',
                phoneNumber: ''
            });
        }
        setShowModal(true);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>User Management</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    Add User
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>
                                    {companies.find(c => c.id === user.companyId)?.name || 'N/A'}
                                </td>
                                <td>
                                    <span className={`badge ${user.active ? 'bg-success' : 'bg-danger'}`}>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openModal(user)}
                                    >
                                        Edit
                                    </Button>
                                    {user.active && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeactivate(user.id)}
                                        >
                                            Deactivate
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedUser ? 'Edit User' : 'Add User'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.firstName}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    firstName: e.target.value
                                }))}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.lastName}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    lastName: e.target.value
                                }))}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    email: e.target.value
                                }))}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    phoneNumber: e.target.value
                                }))}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Select
                                value={formData.companyId}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    companyId: e.target.value
                                }))}
                                required
                            >
                                <option value="">Select Company</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Loading...
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};
