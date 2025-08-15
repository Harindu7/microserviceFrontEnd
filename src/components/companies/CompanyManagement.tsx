import { useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Company, CompanyDTO } from '../../types';
import { CompanyService } from '../../services/companyService';

export const CompanyManagement = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState<CompanyDTO>({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await CompanyService.getAll();
            setCompanies(data);
        } catch (error) {
            toast.error('Failed to load companies');
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
            if (selectedCompany) {
                await CompanyService.update(selectedCompany.id, formData);
                toast.success('Company updated successfully');
            } else {
                await CompanyService.create(formData);
                toast.success('Company created successfully');
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

    const handleDeactivate = async (companyId: string) => {
        if (!window.confirm('Are you sure you want to deactivate this company?')) return;
        
        setLoading(true);
        try {
            await CompanyService.deactivate(companyId);
            toast.success('Company deactivated successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to deactivate company');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (company?: Company) => {
        if (company) {
            setSelectedCompany(company);
            setFormData({
                name: company.name,
                address: company.address,
                phone: company.phone,
                email: company.email,
                description: company.description
            });
        } else {
            setSelectedCompany(null);
            setFormData({
                name: '',
                address: '',
                phone: '',
                email: '',
                description: ''
            });
        }
        setShowModal(true);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Company Management</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    Add Company
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
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id}>
                                <td>{company.name}</td>
                                <td>{company.email}</td>
                                <td>{company.phone}</td>
                                <td>{company.address}</td>
                                <td>
                                    <span className={`badge ${company.active ? 'bg-success' : 'bg-danger'}`}>
                                        {company.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openModal(company)}
                                    >
                                        Edit
                                    </Button>
                                    {company.active && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeactivate(company.id)}
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
                            {selectedCompany ? 'Edit Company' : 'Add Company'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    name: e.target.value
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
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    phone: e.target.value
                                }))}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    address: e.target.value
                                }))}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                required
                            />
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
