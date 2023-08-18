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
    const istDateTime = new Date(new Date(new Date(JSON.parse(data).StartDate).toISOString()).getTime() + (5.5 * 60 * 60 * 1000));
    return `${istDateTime.getUTCFullYear()}-${String(istDateTime.getUTCMonth() + 1).padStart(2, "0")}-${String(istDateTime.getUTCDate()).padStart(2, "0")}T${String(istDateTime.getUTCHours()).padStart(2, "0")}:${String(istDateTime.getUTCMinutes()).padStart(2, "0")}`;
  };

  const createNestedTable = (data, modified = false, pre = data) => {
    if (typeof data !== 'undefined') {
      return Object.keys(data).map((key) => {
        if (key === '0' || key === '1') return <tr className="inAudit"><td></td>{createNestedTable(data[key], key === '1', data["0"])}</tr>
        if (typeof data[key] === "object") return createNestedTable(data[key], modified, pre[key] !== 'undefined' ? pre[key] : pre);
        else return modified ? <dt className="inAudit" id={key}>{pre[key] === data[key] ? data[key] : <s style={{ textDecorationColor: "red" }}>{data[key]}</s>}</dt> : <dt id={key}>{data[key]}</dt>;
      });
    }
  };

  return isLoading ? (
    <dialog open>
      <Loader />
    </dialog>
  ) : (
    <div><h1 style={{
      textAlign: "center"
    }}>Audit Log</h1>
      <table className="inAudit">

        <tr className="inAudit" style={{
          borderBottom: 'solid'
        }}>
          <th id="c" className="inAudit">
            <input
              className="fw-bolder bg-transparent text-black border-0 px-4 inAudit"
              type="button"
              value={"Modified Time"}
              disabled
            /></th>
          <th className="inAudit">ID</th>
          <th className="inAudit">Name</th>
          <th className="inAudit">Phone</th>
          <th className="inAudit">City</th>
          <th className="inAudit">State</th>
          <th className="inAudit">PIN Code</th>
          <th className="inAudit">Country</th>
        </tr>

      </table>
      <table className="table w-100 inAudit">
        <tbody className="w-100 inAudit">
          {auditLog
            .slice()
            .reverse()
            .map((item) => (
              <tr
                className={item.eventType === "EmployeeApi/Update" ? "update inAudit" : "inAudit"}
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
                {/* <td>{item.eventId}</td>  */}

                {/* <td>{item.user}</td> */}
                {/* <td>
                <details className="m-0 p-0">
                  <summary id="mainLog">JSON Data</summary>
                  <ul>{createCollapsibleList(JSON.parse(item.jsonData), item.eventType)}</ul>
                </details>
              </td> */}
                {
                  item.eventType !== "EmployeeApi/Update"
                    ? <tr className="inAudit">
                      <>
                        <input type="button" className="inAudit" value={"Time"}></input>
                        <input
                          className="inAudit fw-bolder"
                          type="datetime-local"
                          value={convertUTCToIST(item.jsonData)}
                          disabled
                        />
                      </><td></td>{createNestedTable(JSON.parse(item.jsonData).Action.ActionParameters.employee)}
                    </tr>
                    : <>
                      <input type="button" className="inAudit" value={"Time"}></input>
                      <input
                        className="inAudit fw-bolder"
                        type="datetime-local"
                        value={convertUTCToIST(item.jsonData)}
                        disabled
                      />
                      {createNestedTable(JSON.parse(item.jsonData).Action.ActionParameters.employee)}
                    </>
                }
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;
