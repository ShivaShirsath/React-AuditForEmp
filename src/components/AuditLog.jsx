import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditLog() {
      try {
        setIsLoading(true);
        const response = await api.get('/audit');
        setAuditLog(response.data);
      } catch (error) {
        console.error("Error fetching audit log:", error);
      }
      setIsLoading(false);
    }
    fetchAuditLog();
  }, []);

  const convertUTCToIST = (data) => {
    const utcDateTime = new Date(new Date(JSON.parse(data).StartDate).toISOString());
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5.5 hours)
    const istDateTime = new Date(utcDateTime.getTime() + istOffset);

    const year = istDateTime.getUTCFullYear();
    const month = String(istDateTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDateTime.getUTCDate()).padStart(2, '0');
    const hours = String(istDateTime.getUTCHours()).padStart(2, '0');
    const minutes = String(istDateTime.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const createCollapsibleList = (data) => {
    const keys = Object.keys(data);
    return keys.map((key) => {
      if (typeof data[key] === "object" && data[key] !== null) {
        return (
          <details style={{ padding: 0 }} key={key}>
            <summary>
              <b><code>{key}</code></b>
            </summary>
            <ul>{createCollapsibleList(data[key])}</ul>
          </details>
        );
      } else {
        return (
          <li key={key}>
            <b><code>{key} : </code></b>
            <code style={{ wordBreak: 'break-all' }}>{data[key]}</code>
          </li>
        );
      }
    });
  };

  return (
    isLoading ? <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50%" cy="50%" r="10%" fill="none" stroke="black" strokeWidth="2">
        <animate attributeName="stroke-dasharray" from="0 25" to="25 0" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
      : <div>
        <h1 align="center">Audit Log</h1>
        <table className="table w-100">
          <thead>
            <tr>
              <th>Event ID</th>
              <th className="text-center">Last Updated Date</th>
              <th>User</th>
              <th>Event Type</th>
              <th className="text-center">JSON Data</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.slice().reverse().map((item) => (
              <tr key={item.eventId} style={{
                '--bs-table-color': `var(--bs-${item.eventType === 'POST Employees/Create' || item.eventType === 'EmployeeApi/Create'
                  ? 'success'
                  : item.eventType === 'POST Employees/Delete' || item.eventType === 'EmployeeApi/Delete'
                    ? 'danger'
                    : item.eventType === 'POST Employees/Edit' || item.eventType === 'EmployeeApi/Update'
                      ? 'warning'
                      : item.eventType === 'GET Employees/Details' || item.eventType === 'EmployeeApi/Details'
                        ? 'primary'
                        : 'dark'
                  })`
              }}>
                <td>{item.eventId}</td>
                <td>
                  <input className="fw-bolder" type="datetime-local" value={convertUTCToIST(item.jsonData)} disabled />
                </td>
                <td>{item.user}</td>
                <td>{item.eventType}</td>
                <td>
                  <details className="m-0 p-0">
                    <summary id="mainLog">JSON Data</summary>
                    <ul>{createCollapsibleList(JSON.parse(item.jsonData))}</ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default AuditLog;
