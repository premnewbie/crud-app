import { Router } from "express";
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
  getClient
} from "../controllers/client.controller.js";

const router = Router();

router.route("/clients").get(getClients);

router.route("/client")    
    .post(createClient);

router.route("/client/:clientId")
    .get(getClient)
    .put(updateClient)
    .delete(deleteClient);

export default router;
