import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { bodyValidator } from '../server';
import { queryAsync } from '../../database';

const router = express.Router();

const songsRoute = (db: sqlite3.Database) => {
  
  router.get("/:login", async (req: Request, res: Response) => {
    try {
      let loginReq = JSON.parse(decodeURIComponent(req.params.login));
      const user = await queryAsync(
        db,
        "SELECT user_id, first_name, last_name, email FROM user WHERE email = ? AND password = ?",
        [loginReq.email, loginReq.password]
      );

      if (user.length) {
        res.json(user[0]);
      } else {
        throw new Error('User Not Found');
      }
    } catch (err) {
      res.status(404).json((err as Error).message);
    }
  });

  router.post("/", async (req: Request, res: Response) => {
    try {
      let newUserReq = req.body.newUser;
      const newUser = await queryAsync(
        db,
        "INSERT INTO user (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?) returning user_id, first_name, last_name, email",
        [newUserReq.firstName, newUserReq.lastName, newUserReq.email, newUserReq.username, newUserReq.password]
      );

      if (newUser.length) {
        res.json(newUser[0]);
      } else {
        throw new Error('User Not Found');
      }
    } catch (err) {
      res.status(404).json((err as Error).message);
    }
  });

  return router;
}

export default songsRoute;
