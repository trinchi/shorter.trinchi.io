import {Router} from "express";
import express from "express";
import shorter from "./shorter";

const ROUTER: Router = express.Router();

ROUTER.use('/v1/shorter', shorter);

export default ROUTER;
