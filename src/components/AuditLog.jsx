import { useState, useEffect } from "react";
import api from "../utils/api";
import { Loader } from "../assets/Loader";
/**
 * Component to display audit logs.
 * Fetches audit data and renders in a table format.
 */
const AuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  // const [perPage] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);

  // Fetch audit log data on component mount
  useEffect(() => {
    fetchAuditLog();
  }, []);

  async function fetchAuditLog() {
    setIsLoading(true);
    const response = await api.get(`/audit?page=${currentPage}`);
    setAuditLog(response.data); // Assuming API returns data in a "data" property
    setTotalPages(response.data.totalPages); // Assuming API returns total number of pages
    setTimeout(() => {
      document.querySelector("dialog").close();
      setIsLoading(false);
    }, 1500);
  }
  // Fetch audit log data on component mount
  useEffect(() => {
    fetchAuditLog();
  }, [currentPage]);

  // Convert UTC to IST date format
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

  // for returning according to Type
  const returnType = (type, text = false) => {
    return type === "POST Employees/Create" || type === "EmployeeApi/Create"
      ? text
        ? "Added"
        : "success"
      : type === "POST Employees/Delete" || type === "EmployeeApi/Delete"
      ? text
        ? "Deleted"
        : "danger"
      : type === "POST Employees/Edit" || type === "EmployeeApi/Update"
      ? text
        ? ""
        : "warning"
      : type === "GET Employees/Details" || type === "EmployeeApi/Details"
      ? text
        ? ""
        : "primary"
      : text
      ? ""
      : "dark";
  };

  const generateTableBody = (data, date, isBody, type, pre) => {
    if (!isBody)
      return (
        <tr
          style={{
            borderBottom: "solid",
          }}
        >
          <th>Table Name</th>
          <th></th>
          {Object.entries(data).map(([key, value]) => {
            if (!key.includes("Id"))
              return <th key={`th-${key}-${value}`}>{key.replace(".", "")}</th>;
            else return <></>;
          })}
          <th>Modified Date</th>
        </tr>
      );
    if (typeof pre !== "undefined")
      return (
        <>
          <tr
            className="border-warning border-bottom-0"
            style={{
              borderTopWidth: ".35dvmin",
            }}
          >
            <td>{type.substring(0, type.indexOf("Api/"))}</td>
            <th key={`td-nv-${data[Object.keys(data)[0]]}`}>New Values</th>
            {Object.entries(data).map(([key, value]) => {
              if (!key.includes("Id"))
                return (
                  <td
                    className={
                      data[key] !== pre[key] ? "table-light" : "notModified"
                    }
                    key={`td-${data[key]}-${key}`}
                  >
                    {isBody ? value : key}
                  </td>
                );
              else return <></>;
            })}
            <td key={`td-mt-${data[Object.keys(data)[0]]}`}>
              <input
                className="inAudit"
                type="datetime-local"
                value={date}
                disabled
              />
            </td>
          </tr>
          <tr
            className="border-warning mod"
            style={{
              borderBottomWidth: ".35dvmin",
            }}
          >
            <td></td>
            <th key={`td-ov-${data[Object.keys(data)[0]]}`}>Old Values</th>

            {Object.entries(pre).map(([key, value]) => {
              if (!key.includes("Id"))
                return (
                  <td
                    key={`td-${data[key]}-${pre[key]}-${key}`}
                    className={
                      data[key] !== pre[key] ? "table-warning" : "notModified"
                    }
                  >
                    {isBody ? value : key}
                  </td>
                );
              else return <></>;
            })}
            <td
              key={`td-mt-${data[Object.keys(data)[0]]}-${
                pre[Object.keys(pre)[0]]
              }`}
            ></td>
          </tr>
        </>
      );
    else
      return (
        <tr
          className={`border-${returnType(type, false)}`}
          style={{
            borderBottomWidth: ".35dvmin",
          }}
        >
          <td>{type.substring(0, type.indexOf("Api/"))}</td>
          <th className={`text-${returnType(type, false)}`}>
            {returnType(type, true)} Values
          </th>
          {Object.entries(data).map(([key, value]) => {
            if (!key.includes("Id")) return <td>{isBody ? value : key}</td>;
            else return <></>;
          })}
          <td>
            <input
              className="inAudit"
              type="datetime-local"
              value={date}
              disabled
            />
          </td>
        </tr>
      );
  };

  const flattenObject = (obj, parentKey = "") => {
    let result = {};

    for (const key in obj) {
      const combinedKey = parentKey ? `${key}.` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        const nestedObj = flattenObject(obj[key], combinedKey);
        result = { ...result, ...nestedObj };
      } else {
        result[combinedKey] = obj[key];
      }
    }

    return result;
  };

  // Create table rows for different event types
  const createTable = (eventType, jsonData, data, pre) => {
    if (eventType === "Head")
      return (
        <>
          {generateTableBody(
            flattenObject(data),
            convertUTCToIST(jsonData),
            false,
            eventType,
            flattenObject(pre)
          )}
        </>
      );
    // for the Updated data
    if (typeof data !== "undefined" && typeof pre !== "undefined") {
      return (
        <>
          {generateTableBody(
            flattenObject(data),
            convertUTCToIST(jsonData),
            true,
            eventType,
            flattenObject(pre)
          )}
        </>
      );
    }

    // for the Create and Delete data
    if (typeof data !== "undefined" && typeof pre === "undefined") {
      return (
        <>
          {generateTableBody(
            flattenObject(data),
            convertUTCToIST(jsonData),
            true,
            eventType
          )}
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
      <h1 className="text-center mb-4">Audit Log</h1>
      <table className="table table-bordered inAudit">
        <tbody className="w-100 inAudit">
          {createTable(
            "Head",
            auditLog[0]["jsonData"],
            JSON.parse(auditLog[0]["jsonData"])["Action"]["ActionParameters"][
              Object.keys(
                JSON.parse(auditLog[0]["jsonData"])["Action"][
                  "ActionParameters"
                ]
              ).length === 1
                ? Object.keys(
                    JSON.parse(auditLog[0]["jsonData"])["Action"][
                      "ActionParameters"
                    ]
                  )[0]
                : Object.keys(
                    JSON.parse(auditLog[0]["jsonData"])["Action"][
                      "ActionParameters"
                    ]
                  )[1]
            ]
          )}
          {auditLog
            .slice()
            .reverse()
            .map((item) =>
              item.eventType !== "EmployeeApi/Update"
                ? createTable(
                    item.eventType,
                    item.jsonData,
                    JSON.parse(item.jsonData).Action.ActionParameters.employee
                  )
                : createTable(
                    item.eventType,
                    item.jsonData,
                    JSON.parse(item.jsonData).Action.ActionParameters
                      .employee[0],
                    JSON.parse(item.jsonData).Action.ActionParameters
                      .employee[1]
                  )
            )}
        </tbody>
      </table>
      <div>
        <div className="pagination">
          <div className="page-info"></div>
          <button
            className="btn btn-primary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
            {auditLog.length}
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default AuditLog;
