import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetails from './components/EmployeeDetails';
import EmployeeForm from './components/EmployeeForm';

function App() {
  return (
    <>
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
                  <a className="nav-link text-success" href='/'>Employee</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-warning " href='/audit'>Audit Log</a>
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
            path="/:id"
            element={
              <EmployeeDetails />
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
