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
      setIsLoading(false);
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
  const createNestedTable = (jsonData, data, pre) => {
    console.log(data); console.log(pre);
    if (typeof data !== "undefined" && typeof pre === "undefined") {
      return <tr>
        <tr>
        <td>{data.Name}</td>
        <td>{data.Phone}</td>
        <td>{data.Address?.City}</td>
        <td>{data.Address?.State}</td>
        <td>{data.Address?.ZipCode}</td>
        <td>{data.Address?.Country}</td>
        <td>{
          <input
            className="inAudit fw-bolder"
            type="datetime-local"
            value={convertUTCToIST(jsonData)}
            disabled
          />
        }</td>
      </tr>
      <tr></tr>
      </tr >
    }
    if (typeof data !== "undefined" && typeof pre !== "undefined"){
      return <tr>
        <tr>
        <td>{data.Name}</td>
        <td>{data.Phone}</td>
        <td>{data.Address?.City}</td>
        <td>{data.Address?.State}</td>
        <td>{data.Address?.ZipCode}</td>
        <td>{data.Address?.Country}</td>
        <td>{
          <input
            className="inAudit fw-bolder"
            type="datetime-local"
            value={convertUTCToIST(jsonData)}
            disabled
          />
        }</td>
      </tr>
      <tr>
        <td>{pre.Name}</td>
        <td>{pre.Phone}</td>
        <td>{pre.Address?.City}</td>
        <td>{pre.Address?.State}</td>
        <td>{pre.Address?.ZipCode}</td>
        <td>{pre.Address?.Country}</td>
        <td></td>
      </tr>
      </tr>
    }
    // if (typeof data !== "undefined") {
    //   return Object.keys(data).map((key) => {
    //     if (key === "0" || key === "1")
    //       return (
    //         <tr key={`${key}`} className="inAudit">
    //           <td>{key === "1"?"Old Values":"New Values"}</td>
    //           {createNestedTable(data[key], key === "1", data["0"])}
    //           <td></td>
    //         </tr>
    //       );
    //     if (typeof data[key] === "object")
    //       return createNestedTable(
    //         data[key],
    //         modified,
    //         pre[key] !== "undefined" ? pre[key] : pre
    //       );
    //     else
    //       return modified ? (
    //         <dt className="inAudit" id={key}>
    //           {pre[key] === data[key] ? (
    //             data[key]
    //           ) : (
    //             <s style={{ textDecorationColor: "red" }}>{data[key]}</s>
    //           )}
    //         </dt>
    //       ) : (
    //         <dt id={key}>{data[key]}</dt>
    //       );
    //   });
    // }
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
      <table className="inAudit">
          <tr
            className="inAudit"
            style={{
              borderBottom: "solid",
            }}
          >

            <th className="inAudit">ID</th>
            <th className="inAudit">Name</th>
            <th className="inAudit">Phone</th>
            <th className="inAudit">City</th>
            <th className="inAudit">State</th>
            <th className="inAudit">PIN Code</th>
            <th className="inAudit">Country</th>
            <th className="inAudit">
              <input
                id="modifiedTime"
                className="fw-bolder text-dark inAudit"
                type="button"
                value={"Data"}
                disabled
              />
            </th>
          </tr>
      </table>
        <table className="table w-100 inAudit">
          <tbody className="w-100 inAudit"
            style={{
              marginBottom: "7dvmin"
            }}
        >
          {auditLog
            .slice()
            .reverse()
            .map((item) => (
              <tr
                className={
                  item.eventType === "EmployeeApi/Update"
                    ? "update inAudit"
                    : "inAudit"
                }
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
                {
                  item.eventType !== "EmployeeApi/Update" ? (
                  <tr className="inAudit">
                      {createNestedTable(item.jsonData,
                      JSON.parse(item.jsonData).Action.ActionParameters.employee
                    )}
                      <td></td>
                  </tr>
                  ) : (item.eventType !== "EmployeeApi/Update"?
                <tr>
                        {createNestedTable(item.jsonData,
                          JSON.parse(item.jsonData).Action.ActionParameters.employee[0],
                          JSON.parse(item.jsonData).Action.ActionParameters.employee[1]
                        )}
                        <td></td>
                  </tr>
                      : <></>)}
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default AuditLog;
