import React, { useEffect, useState } from "react";
import { useCrudStore } from "../store/useCrudStore";
import { getClient } from "../../../backend/controllers/client.controller";

export default function ModalForm({ isOpen, onClose, mode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "",
    rate: "",
    isactive: false,
  });

  const { updateClient, createClient, client, clientId, isLoading } =
    useCrudStore();

  const handleChange = (e) => {
    const value =
      e.target.name === "isactive"
        ? e.target.value === "Active"
        : e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      createClient(formData);
    } else if (mode === "edit") {
      updateClient(formData, clientId);
    }
    onClose();
  };

  useEffect(() => {
    getClient(clientId);
    if (mode === "edit") {
      if (!isLoading) {
        setFormData({
          name: client.name,
          email: client.email,
          job: client.job,
          rate: client.rate,
          isactive: client.isactive,
        });
      }
    }
  }, [clientId,client,isLoading,mode]);

  return (
    <>
      <dialog id="my_modal_3" className="modal" open={isOpen}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {mode === "edit" ? "Edit Client" : "Client Details"}
          </h3>
          <form method="dialog" onSubmit={handleSubmit}>
            <label className="input my-4 flex items-center gap-2">
              Name
              <input
                type="text"
                className="grow"
                name="name"
                value={formData.name}
                placeholder=""
                onChange={handleChange}
                required
              />
            </label>
            <label className="input my-4 flex items-center gap-2">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                className="grow"
                placeholder=""
                onChange={handleChange}
                required
              />
            </label>
            <label className="input my-4 flex items-center gap-2">
              Job
              <input
                type="text"
                name="job"
                value={formData.job}
                className="grow"
                placeholder=""
                onChange={handleChange}
                required
              />
            </label>
            <div className="flex gap-2 mb-4 justify-between">
              <label className="input input-bordered flex items-center gap-2">
                Rate
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  className="grow"
                  placeholder=""
                  onChange={handleChange}
                  required
                />
              </label>
              <select
                value={formData.isactive === true ? "Active" : "Inactive"}
                name="isactive"
                className="select"
                onChange={handleChange}
                required
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>
            <button className="btn btn-success" type="submit">
              {mode === "edit" ? "Save Changes" : "Add Client"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
