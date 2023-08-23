import { useState, useEffect } from "react";
import api from "../utils/api";
import { Loader } from "../assets/Loader";
import "./Audit.css";
const AuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchAuditLog() {
      setIsLoading(true);
      const response = await api.get("/audit");
      setAuditLog(response.data);
      setTimeout(() => {
        document.querySelector("dialog").close();
        setIsLoading(false);
      }, 1500);
    }
    fetchAuditLog();
  }, []);
  const convertUTCToIST = (data) => {
    const istDateTime = new Date(
      new Date(new Date(JSON.parse(data).StartDate).toISOString()).getTime() +
      5.5 * 60 * 60 * 1000
    );
    return `${istDateTime.getUTCFullYear()}-${String(
      istDateTime.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(istDateTime.getUTCDate()).padStart(
      2,
      "0"
    )}T${String(istDateTime.getUTCHours()).padStart(2, "0")}:${String(
      istDateTime.getUTCMinutes()
    ).padStart(2, "0")}`;
  };
  const createNestedTable = (eventType, jsonData, data, pre) => {
    if (typeof data !== "undefined" && typeof pre !== "undefined") {
      return (
        <>
          <tr key={`${eventType}1`} className="border-warning border-bottom-0" style={{
            borderTopWidth: '.35dvmin'
          }}>
            <th>New Values</th>
            <td className={pre.Name !== data.Name ? "table-light" : "notModified"}>{data.Name}</td>
            <td className={pre.Phone !== data.Phone ? "table-light" : "notModified"}>{data.Phone}</td>
            <td className={pre.Address?.City !== data.Address?.City ? "table-light" : "notModified"}>{data.Address?.City}</td>
            <td className={pre.Address?.State !== data.Address?.State ? "table-light" : "notModified"}>{data.Address?.State}</td>
            <td className={pre.Address?.ZipCode !== data.Address?.ZipCode ? "table-light" : "notModified"}>{data.Address?.ZipCode}</td>
            <td className={pre.Address?.Country !== data.Address?.Country ? "table-light" : "notModified"}>{data.Address?.Country}</td>
            <td key={`${eventType}1-md`}>
              {
                <input
                  className="inAudit fw-bolder"
                  type="datetime-local"
                  value={convertUTCToIST(jsonData)}
                  disabled
                />
              }
            </td>
          </tr>
          <tr key={`${eventType}2`} className="border-warning mod" style={{
            borderBottomWidth: '.35dvmin'
          }}>
            <th key={`${eventType}2n`} className="notModified">Old Values</th>
            <td className={pre.Name !== data.Name ? "table-warning" : "notModified"} key={`${eventType}2-${pre.Name}`}>{pre.Name}</td>
            <td className={pre.Phone !== data.Phone ? "table-warning" : "notModified"} key={`${eventType}2-${pre.Phone}`}>{pre.Phone}</td>
            <td className={pre.Address?.City !== data.Address?.City ? "table-warning" : "notModified"} key={`${eventType}2-${pre.Address?.City}`}>{pre.Address?.City}</td>
            <td className={pre.Address?.State !== data.Address?.State ? "table-warning" : "notModified"} key={`${eventType}2-${pre.Address?.State}`}>{pre.Address?.State}</td>
            <td className={pre.Address?.ZipCode !== data.Address?.ZipCode ? "table-warning" : "notModified"} key={`${eventType}2-${pre.Address?.ZipCode}`}>{pre.Address?.ZipCode}</td>
            <td className={pre.Address?.Country !== data.Address?.Country ? "table-warning" : "notModified"} key={`${eventType}2-${pre.Address?.Country}`}>{pre.Address?.Country}</td>
            <td key={`${eventType}2-md`}></td>
          </tr>
        </>
      );
    }
    if (typeof data !== "undefined" && typeof pre === "undefined") {
      return (
        <>
          <tr className={`border-${eventType === "POST Employees/Create" || eventType === "EmployeeApi/Create"
            ? "success"
            : eventType === "POST Employees/Delete" || eventType === "EmployeeApi/Delete"
              ? "danger"
              : eventType === "POST Employees/Edit" || eventType === "EmployeeApi/Update"
                ? "warning"
                : eventType === "GET Employees/Details" || eventType === "EmployeeApi/Details"
                  ? "primary"
                  : "dark"
            }`} style={{
              borderBottomWidth: '.35dvmin'
            }}>
            <th className={`text-${eventType === "POST Employees/Create" || eventType === "EmployeeApi/Create"
              ? "success"
              : eventType === "POST Employees/Delete" || eventType === "EmployeeApi/Delete"
                ? "danger"
                : eventType === "POST Employees/Edit" || eventType === "EmployeeApi/Update"
                  ? "warning"
                  : eventType === "GET Employees/Details" || eventType === "EmployeeApi/Details"
                    ? "primary"
                    : "dark"
              }`} key={`${eventType}n`}>{`${eventType === "POST Employees/Create" || eventType === "EmployeeApi/Create"
                ? "Added"
                : eventType === "POST Employees/Delete" || eventType === "EmployeeApi/Delete"
                  ? "Deleted"
                  : eventType === "POST Employees/Edit" || eventType === "EmployeeApi/Update"
                    ? "Updated"
                    : eventType === "GET Employees/Details" || eventType === "EmployeeApi/Details"
                      ? "*"
                      : "-"
                } Values`}
            </th>
            <td key={`${eventType}-${data.Name}`}>{data.Name}</td>
            <td key={`${eventType}-${data.Phone}`}>{data.Phone}</td>
            <td key={`${eventType}-${data.Address?.City}`}>{data.Address?.City}</td>
            <td key={`${eventType}-${data.Address?.State}`}>{data.Address?.State}</td>
            <td key={`${eventType}-${data.Address?.ZipCode}`}>{data.Address?.ZipCode}</td>
            <td key={`${eventType}-${data.Address?.Country}`}>{data.Address?.Country}</td>
            <td key={`${eventType}-md`}>
              {
                <input
                  className="inAudit fw-bolder"
                  type="datetime-local"
                  value={convertUTCToIST(jsonData)}
                  disabled
                />
              }
            </td>
          </tr>
          <tr key={`${eventType}mt`}></tr>
        </>
      );
    }
  };
  return isLoading ? (
    <dialog open>
      <Loader />
    </dialog>
  ) : (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Audit Log
      </h1>
      <table className="table table-bordered inAudit" >
        <tbody
          className="w-100 inAudit"
        >
          <tr
            key={"tr1"}
            className="table-light border-dark"
            style={{
              borderBottom: "solid",
            }}
          >
            <th key={"th1"} className="inAudit"></th>
            <th key={"th2"} className="inAudit">Name</th>
            <th key={"th3"} className="inAudit">Phone</th>
            <th key={"th4"} className="inAudit">City</th>
            <th key={"th5"} className="inAudit">State</th>
            <th key={"th6"} className="inAudit">PIN Code</th>
            <th key={"th7"} className="inAudit">Country</th>
            <th key={"th8"} className="inAudit">Modified Date</th>
          </tr>
          {auditLog
            .slice()
            .reverse()
            .map((item) => (
              item.eventType !== "EmployeeApi/Update" ? (
                createNestedTable(
                  item.eventType,
                  item.jsonData,
                  JSON.parse(item.jsonData).Action.ActionParameters.employee
                )
              )
                : createNestedTable(
                  item.eventType,
                  item.jsonData,
                  JSON.parse(item.jsonData).Action.ActionParameters
                    .employee[0],
                  JSON.parse(item.jsonData).Action.ActionParameters
                    .employee[1]
                )
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default AuditLog;
