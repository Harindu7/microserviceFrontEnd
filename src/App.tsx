import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Navigation } from './components/layout/Navigation';
import { UserManagement } from './components/users/UserManagement';
import { CompanyManagement } from './components/companies/CompanyManagement';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/companies" element={<CompanyManagement />} />
                    <Route path="/" element={<Navigate to="/users" replace />} />
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </Router>
        </ErrorBoundary>
    );
};
