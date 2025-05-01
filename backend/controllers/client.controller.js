import pool from "../db/db.js";

export const getClients = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM clients_tb");
    if (rows.length > 0) {
      return res.status(200).json({
        "clients": rows,
        "message": "Successfully fetched the clients",
        "success": true,
      });
    } else {
      return res
        .status(200)
        .json({ "clients": [], "message": "No clients found", "success": true });
    }
  } catch (e) {
    console.log(
      "Error from the getClients function in Client controller",
      e.message
    );
    return res
      .status(500)
      .json({ "message": "Internal Server Error", "success": false });
  }
};

export const getClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const { rows } = await pool.query(`SELECT * FROM clients_tb where id=${clientId}`);
    if (rows.length > 0) {
      return res.status(200).json({
        "client": rows[0],
        "message": "Successfully fetched the client",
        "success": true,
      });
    } else if(rows.length===0) {
      return res
        .status(200)
        .json({ "client": null, "message": "No client found", "success": true });
    }
  } catch (e) {
    console.log(
      "Error from the getClient function in Client controller",
      e.message
    );
    return res
      .status(500)
      .json({ "message": "Internal Server Error", "success": false });
  }
};

export const createClient = async (req, res) => {
  try {
    const { clientData } = req.body;
    const { name, email, job, rate, isActive } = clientData;

    const query = `
        INSERT INTO clients_tb (name, email, job, rate, isactive) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

    const values = [name, email, job, rate, isActive];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.status(201).json({
        "client": result.rows[0],
        "message": "Successfully created a new client",
        "success": true,
      });
    } else {
      res.status(400).json({
        "message": "Failed to create client",
        "success": false,
      });
    }
  } catch (e) {
    console.log(
      "Error from create client function in the client controller",
      e.message
    );
    return res
      .status(500)
      .json({ "message": "Internal Server Error", "success": false });
  }
};

export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const { name, email, job, rate, isActive } = req.body;

    const { rows } = await pool.query(
      `SELECT * FROM clients_tb where id=${clientId}`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        "success": false,
        "message": "Client not found"
      });
    }

    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (name !== undefined && name !== rows[0].name) {
      fieldsToUpdate.push("name");
      valuesToUpdate.push(name);
    }
    if (email !== undefined && email !== rows[0].email) {
      fieldsToUpdate.push("email");
      valuesToUpdate.push(email);
    }
    if (job !== undefined && job !== rows[0].job) {
      fieldsToUpdate.push("job");
      valuesToUpdate.push(job);
    }
    if (rate !== undefined && rate !== rows[0].rate) {
      fieldsToUpdate.push("rate");
      valuesToUpdate.push(rate);
    }
    if (isActive !== undefined && isActive !== rows[0].isactive) {
      fieldsToUpdate.push("isactive");
      valuesToUpdate.push(isActive);
    }

    if (fieldsToUpdate.length > 0) {
      const setClause = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");

      const query = `UPDATE clients_tb SET ${setClause} WHERE id = ${clientId} RETURNING *`;

      const updateResult = await pool.query(query, valuesToUpdate);

      return res.status(200).json({
        "success": true,
        "message": "Client updated successfully",
        "client": updateResult.rows[0],
      });
    } else {
      return res.status(200).json({
        "success": true,
        "message": "No changes to update",
      });
    }
  } catch (e) {
    console.log(
      "Error from update client function in the client controller",
      e.message
    );
    return res
      .status(500)
      .json({ "message": "Internal Server Error", "success": false });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    const checkClient = await pool.query(
      'SELECT * FROM clients_tb WHERE id = $1',
      [clientId]
    );
    
    if (checkClient.rows.length === 0) {
      return res.status(404).json({
        "success": false,
        "message": "Client not found"
      });
    }

    const deleteResult = await pool.query(
      'DELETE FROM clients_tb WHERE id = $1 RETURNING *',
      [clientId]
    );
    
    return res.status(200).json({
      "success": true,
      "message": "Client deleted successfully",
    });
    
  } catch (e) {
    console.log(
      "Error from delete client function in the client controller",
      e.message
    );
    return res
      .status(500)
      .json({ "message": "Internal Server Error", "success": false });
  }
};
