import { useState, useEffect } from "react";
import api from "../utils/api";
import { Loader } from "../assets/Loader";
import uuid from "react-uuid";
import Toggle from 'react-bootstrap-toggle';

/**
 * Component to display audit logs.
 * Fetches audit data and renders in a table format.
 */
const AuditLog = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  // const [perPage] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [eventType, setEventType] = useState("all");
  const [action, setAction] = useState("all");
  const [eventTypeList, setEventTypeList] = useState([]);
  const [actionList, setActionList] = useState([]);
  const [isAssending, setIsAssending] = useState(false);

  // Fetch audit log data on component mount
  async function fetchAuditLog() {
    setIsLoading(true);
    const response = await api.get(
      `/audit?eventType=${eventType === "all"
        ? "all"
        : eventType + (action === "all" ? "" : "Api/" + action)
      }&page=${currentPage}`
    );
    setAuditLog(response.data.data);
    setTotalPages(response.data.totalPages);
    setIsLoading(false);
  }
  useEffect(() => {
    setAuditLog(auditLog.slice()
      .reverse())
  }, [isAssending]);
  async function fetchAuditTables() {
    setIsLoading(true);
    const response = await api.get(`/audit/Tables`);
    setEventTypeList(response.data);
    setIsLoading(false);
  }

  // Fetch audit log data on component mount
  useEffect(() => {
    if (
      eventType === "all" ||
      (Array.isArray(eventTypeList) && eventTypeList.length)
    ) {
      fetchAuditTables();
    }
  }, []);

  useEffect(() => {
    if (currentPage === 0) {
      console.log("MT");
    } else {
      fetchAuditLog();
    }
    if (eventType === "all") {
      setActionList([]);
    }
  }, [currentPage, eventType, action]);

  useEffect(() => {
    if (eventType === "all") {
      setActionList([]);
    } else if (Array.isArray(eventTypeList) && eventTypeList.length) {
      setActionList(
        eventTypeList
          .filter((event) => event.includes(eventType))
          .map((ev) => ev.substring(ev.indexOf("Api/") + 4, ev.length))
      );
      setAction(
        Object.values(
          eventTypeList
            .filter((event) => event.includes(eventType))
            .map((ev) => ev.substring(ev.indexOf("Api/") + 4, ev.length))
        ).includes(action)
          ? action
          : "all"
      );
    }
  }, [eventType]);

  useEffect(() => {
    setCurrentPage(1);
    if (
      Array.isArray(eventTypeList) &&
      eventTypeList.length &&
      eventType !== "all"
    ) {
      setActionList(
        eventTypeList
          .filter((event) => event.includes(eventType))
          .map((ev) => ev.substring(ev.indexOf("Api/") + 4, ev.length))
      );
    } else if (eventType === "all") {
      setActionList([]);
    }
  }, [eventTypeList]);

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
  const returnType = (type, text = false, isAll = false) => {
    return type.includes("Create")
      ? text
        ? "Added"
        : "success"
      : type.includes("Delete")
        ? text
          ? "Deleted"
          : "danger"
        : type.includes("Edit") || type.includes("Update")
          ? text
            ? isAll
              ? "Updated"
              : ""
            : "warning"
          : type.includes("Details")
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
          key={uuid()}
          style={{
            borderBottom: "solid",
          }}
        >
          {/* <th>Table Name</th> */}
          <th key={`mt-${uuid()}`}></th>
          {Object.entries(data).map(([key, value]) => {
            if (!key.includes("Id"))
              return (
                <th key={`th-${key}-${value}${uuid()}`}>
                  {key.replace(".", "")}
                </th>
              );
            else return <></>;
          })}
          <th key={`md-${uuid()}`}>Modified Date</th>
        </tr>
      );
    if (typeof pre !== "undefined")
      return (
        <>
          <tr
            key={"tr-" + uuid()}
            className="border-warning border-bottom-0"
            style={{
              borderTopWidth: ".35dvmin",
            }}
          >
            {/* <td>{type.substring(0, type.indexOf("Api/"))}</td> */}
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
            {/* <td></td> */}
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
              key={`td-mt-${data[Object.keys(data)[0]]}-${pre[Object.keys(pre)[0]]
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
          {/* <td>{type.substring(0, type.indexOf("Api/"))}</td> */}
          <th className={`text-${returnType(type, false)}`}>
            {returnType(type, true, eventType === "all")}{" "}
            {eventType === "all" ? "" : "Values"}
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

  const flattenObject = (obj, parentKey = "", tableName) => {
    if (eventType === "all")
      return {
        "Table Name":
          tableName !== undefined
            ? tableName.substring(0, tableName.indexOf("Api/"))
            : "",
      };
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
  const createTable = (EventType, jsonData, data, pre) => {
    if (EventType === "Head")
      return (
        <>
          {generateTableBody(
            flattenObject(data),
            convertUTCToIST(jsonData),
            false,
            EventType,
            flattenObject(pre)
          )}
        </>
      );
    // for the Updated data
    if (typeof data !== "undefined" && typeof pre !== "undefined") {
      return (
        <>
          {generateTableBody(
            flattenObject(data, "", EventType),
            convertUTCToIST(jsonData),
            true,
            EventType,
            eventType === "all" ? undefined : flattenObject(pre, "", EventType)
          )}
        </>
      );
    }

    // for the Create and Delete data
    if (typeof data !== "undefined" && typeof pre === "undefined") {
      return (
        <>
          {generateTableBody(
            flattenObject(data, "", EventType),
            convertUTCToIST(jsonData),
            true,
            EventType
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
    <div><div style={{ textAlign: 'right' }}>
      <Toggle
        onClick={() => {
          setIsAssending(!isAssending);
        }}
        on={'Assending'}
        off={'Decending'}
        size="xs"
        offstyle="danger"
        active={isAssending}
      />
    </div>
      <h1 className="text-center mb-4">
        Audit Logs {auditLog.length === 0 && "not found !"}
      </h1>

      {auditLog.length !== 0 && (
        <>
          <table className="table table-bordered inAudit">
            <tbody className="w-100 inAudit">
              <tr style={{
                borderBottom: 'solid'
              }}>
                <th>{eventType === 'all' ? "Select Table" : "Table Name"}</th>
                <td>
                  <select
                    name="eventType"
                    value={eventType}
                    className="form-select"
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setEventType(value);
                    }}
                    id="eventDropdown"
                    required
                  >
                    <option value={"all"}>all</option>
                    {Array.from(
                      new Set(
                        eventTypeList.map((ev) =>
                          ev.substring(0, ev.indexOf("Api/"))
                        )
                      )
                    ).map((event) => (
                      <option key={event} value=/*{event}*/ {event}>
                        {/* {event} */}
                        {event}
                      </option>
                    ))}
                  </select>
                </td>
                {
                  eventType !== 'all' &&
                  <>
                    <th>Action</th>
                    <td>
                      <select
                        name="action"
                        value={action}
                        className="form-select"
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setAction(value);
                        }}
                        id="actionDropdown"
                        required
                      >
                        <option value={"all"}>all</option>
                        {Array.from(new Set(actionList.map((ev) => ev))).map(
                          (event) => (
                            <option
                              key={event.substring(0, event.indexOf("Api/"))}
                              value={
                                event
                              } /*{event.substring(0, event.indexOf("Api/"))}*/
                            >
                              {event}
                              {/* {event.substring(0, event.indexOf("Api/"))} */}
                            </option>
                          )
                        )}
                      </select>
                    </td> </>}
              </tr>
              {createTable(
                "Head",
                auditLog[0]["jsonData"],
                JSON.parse(auditLog[0]["jsonData"])["Action"][
                "ActionParameters"
                ][
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
              {auditLog.map((item) =>
                !item.eventType.includes("Update")
                  ? createTable(
                    item.eventType,
                    item.jsonData,
                    JSON.parse(item["jsonData"])["Action"][
                    "ActionParameters"
                    ][
                    Object.keys(
                      JSON.parse(item["jsonData"])["Action"][
                      "ActionParameters"
                      ]
                    ).length === 1
                      ? Object.keys(
                        JSON.parse(item["jsonData"])["Action"][
                        "ActionParameters"
                        ]
                      )[0]
                      : Object.keys(
                        JSON.parse(item["jsonData"])["Action"][
                        "ActionParameters"
                        ]
                      )[1]
                    ]
                  )
                  : createTable(
                    item.eventType,
                    item.jsonData,
                    JSON.parse(item["jsonData"])["Action"][
                    "ActionParameters"
                    ][
                    Object.keys(
                      JSON.parse(item["jsonData"])["Action"][
                      "ActionParameters"
                      ]
                    ).length === 1
                      ? Object.keys(
                        JSON.parse(item["jsonData"])["Action"][
                        "ActionParameters"
                        ]
                      )[0]
                      : Object.keys(
                        JSON.parse(item["jsonData"])["Action"][
                        "ActionParameters"
                        ]
                      )[1]
                    ],
                    JSON.parse(item["jsonData"])["Action"][
                    "ActionParameters"
                    ][
                    Object.keys(
                      JSON.parse(item["jsonData"])["Action"][
                      "ActionParameters"
                      ]
                    ).length === 1
                      ? Object.keys(
                        JSON.parse(item["jsonData"])["Action"][
                        "ActionParameters"
                        ]
                      )[0]
                      : Object.keys(
                        JSON.parse(item["jsonData"])["Action"][
                        "ActionParameters"
                        ]
                      )[1]
                    ]
                  )
              )}
            </tbody>
          </table>
          <div>
            <div className="pagination">
              <button
                className="btn btn-primary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
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
        </>
      )}
    </div>
  );
};
export default AuditLog;
