import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import AuditLog from './components/AuditLog';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={2}
        toastOp
        tions={{
          icon: "✅",
          style: {
            borderRadius: "1.5dvmin",
            background: "hsla(0, 0%, 0%, 0.5)",
            backdropFilter: "blur(.25dvmin)",
            color: "#fff",
          },
        }}
      />
      <header>
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark border-bottom box-shadow mb-3 text-white">
          <div className="container-fluid">
            <a className="navbar-brand border-end" href='/'>Employee Audit &nbsp;</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
              <ul className="navbar-nav flex-grow-1 fw-bolder">
                <li className="nav-item">
                  <Link className="nav-link text-success" to={'/'}>Employee</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning " to={'/audit'}>Audit Log</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <EmployeeList />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <EmployeeForm />
            }
          />
          <Route
            path="/add"
            element={
              <EmployeeForm />
            }
          /><Route
            path="/audit"
            element={
              <AuditLog />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="border-top footer text-muted">
        <div className="container">
          &copy; 2023 - EmpAddrAudit - <a asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
        </div>
      </footer>
    </>
  );
}

export default App;