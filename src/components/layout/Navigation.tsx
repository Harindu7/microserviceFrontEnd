import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
    const location = useLocation();
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">React 19 CRUD</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/users" 
                            active={location.pathname === '/users'}
                        >
                            Users
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/companies" 
                            active={location.pathname === '/companies'}
                        >
                            Companies
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
