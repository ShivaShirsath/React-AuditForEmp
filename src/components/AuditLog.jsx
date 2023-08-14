import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Loader } from "../assets/Loader";

const AuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditLog() {
      setIsLoading(true);
      const response = await api.get("/audit");
      setAuditLog(response.data);
      setIsLoading(false);
    }
    fetchAuditLog();
  }, []);

  const convertUTCToIST = (data) => {
    const istDateTime = new Date(new Date(new Date(JSON.parse(data).StartDate).toISOString()).getTime() + (5.5 * 60 * 60 * 1000));
    return `${istDateTime.getUTCFullYear()}-${String(istDateTime.getUTCMonth() + 1).padStart(2, "0")}-${String(istDateTime.getUTCDate()).padStart(2, "0")}T${String(istDateTime.getUTCHours()).padStart(2, "0")}:${String(istDateTime.getUTCMinutes()).padStart(2, "0")}`;
  };

  const createCollapsibleList = (data, eventType) => {
    const keys = Object.keys(data);
    return keys.map((key) => {
      if (eventType === "EmployeeApi/Update" && key === "ActionParameter") {
        return <></>
      }
      else if (typeof data[key] === "object" && data[key] !== null) {
        return (
          <details style={{ padding: 0 }} key={key}>
            <summary>
              <b>
                <code>{key}</code>
              </b>
            </summary>
            <ul>{createCollapsibleList(data[key], eventType)}</ul>
          </details>
        );
      }
      else {
          if (
          key === "EmployeeId" ||
          key === "Name" ||
          key === "Phone" ||
          key === "Address" ||
          key === "AddressId" ||
          key === "City" ||
          key === "State" ||
          key === "ZipCode" ||
          key === "Country" 
          ) 
            return (
              <li key={key} >
          <b>
            <code>{key} : </code>
          </b>
          <code style={{ wordBreak: "break-all" }}>{data[key]}</code>
        </li >
          
        );
      }
    }
    );
  };

  return isLoading ? (
    <dialog open>
      <Loader />
    </dialog>
  ) : (
    <>
      <h1 align="center">Audit Log</h1>
      <table className="table w-100">
        <thead>
          <tr>
            <th>Event ID</th>
            <th className="text-center">Last Updated Date</th>
            <th>User</th>
            <th className="text-center">Logs</th>
          </tr>
        </thead>
        <tbody>
          {auditLog
            .slice()
            .reverse()
            .map((item) => (
              <tr
                key={item.eventId}
                style={{
                  "--bs-table-color": `var(--bs-${item.eventType === "POST Employees/Create" ||
                    item.eventType === "EmployeeApi/Create"
                    ? "success"
                    : item.eventType === "POST Employees/Delete" ||
                      item.eventType === "EmployeeApi/Delete"
                      ? "danger"
                      : item.eventType === "POST Employees/Edit" ||
                        item.eventType === "EmployeeApi/Update"
                        ? "warning"
                        : item.eventType === "GET Employees/Details" ||
                          item.eventType === "EmployeeApi/Details"
                          ? "primary"
                          : "dark"
                    })`,
                }}
              >
                <td>{item.eventId}</td>
                <td>
                  <input
                    className="fw-bolder"
                    type="datetime-local"
                    value={convertUTCToIST(item.jsonData)}
                    disabled
                  />
                </td>
                <td>{item.user}</td>
                <td>
                  <details className="m-0 p-0">
                    <summary id="mainLog">JSON Data</summary>
                    <ul>{createCollapsibleList(JSON.parse(item.jsonData), item.eventType)}</ul>
                  </details>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default AuditLog;
