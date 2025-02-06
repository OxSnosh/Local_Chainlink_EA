import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

type EAInput = {
  requestId: number | string;
  data: {
    inputNumber: number
  };
};

type EAOutput = {
  requestId: string | number;
  data: {
    product: number
  };
  statusCode: number;
  error?: string;
};

const PORT = 8081;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {

  const eaInputData: EAInput = req.body;
  // console.log("Request data received: ", eaInputData);

    let answer = eaInputData.data.inputNumber * 1000

    console.log("Answer: ", answer);
    console.log("Request ID: ", eaInputData.requestId);
    console.log("other Request ID: ", req.body.requestId);

    let eaResponse: EAOutput = {
    requestId: req.body.requestId,
    data: {
      product: answer,
    },
    statusCode: 200,
  };

  try {
    // It's common practice to store the desired result value in a top-level result field.
    eaResponse.statusCode = 200;
    console.log("returned response:  ", eaResponse);
    res.json(eaResponse);
} catch (error: any) {
    console.error("Response Error: ", error);
    eaResponse.error = error.message;
    eaResponse.statusCode = error.response.status;
    
    res.json(eaResponse);
}

  return;
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.info("\nShutting down server...");
  process.exit(0);
});