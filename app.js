const express = require('express');
const connectDB = require('./src/Config/database');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config({});
const cors = require('cors');

// app.use(
//   cors({
//     origin: "http://localhost:5174",
//     credentials: true,
//   })
// );

const allowedOrigins = [
	process.env.CLIENT_ORIGIN,
	'http://localhost:5173',
	'http://localhost:5174',
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true, // ✅ Required for cookies/auth headers
	})
);

app.use(express.json());
app.use(cookieParser());

//routes
const authRouter = require('./src/routes/auth');
const profileRouter = require('./src/routes/profile');
const requestRouter = require('./src/routes/request');
const userRouter = require('./src/routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

//database connect before server
connectDB().then(() => {
	try {
		app.listen(process.env.PORT, () => {
			console.log(`Server running on ` + process.env.PORT);
		});
	} catch (error) {
		console.log(error);
	}
});
