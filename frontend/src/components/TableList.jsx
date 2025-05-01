import React, { useEffect } from "react";
import { useCrudStore } from "../store/useCrudStore";

function TableList({ handleOpen }) {
  const { getClients, clients, isLoading, setClientId, deleteClient } =
    useCrudStore();

  const handleUpdate = (clientId) => {
    handleOpen("edit");
    setClientId(clientId);
  };

  const handleDelete = (clientId) => {
    deleteClient(clientId);
  };

  useEffect(() => {
    getClients();
  }, [getClients]);

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }
  console.log(clients)

  return (
    <div className="overflow-x-auto mt-10">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients?.map((client, idx) => (
            <tr key={idx} className="hover:bg-base-300">
              <th>{idx + 1}</th>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.job}</td>
              <td>{client.rate}</td>
              <td>
                <button
                  className={`btn rounded-full w-20 ${
                    client.isactive ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {client.isactive ? "Active" : "Inactive"}
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdate(client.id)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-accent"
                  onClick={() => handleDelete(client.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableList;
