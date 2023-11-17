import express, { Request, Response } from "express"
import AuthRoute from "../Auth/routes/Auth.routes"
import UserRoute from "../Users/routes/User.routes"

const router = express.Router()

router.get("/", (req: Request, res: Response) => {
	res.send({ message: "Welcome to Lendsqr Assessment API" });
  });
router.get(`/healthcheck`, (req: Request, res: Response) => {
	try {
		res.send({
			uptime: Math.round(process.uptime()),
			message: 'OK',
			timestamp: Date.now()
		});
	} catch (e) {
		res.status(503).end();
	}
});

router.use("/auth", AuthRoute)
router.use("/users", UserRoute)

export default router;
