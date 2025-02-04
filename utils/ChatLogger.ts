import fs from "fs";
import path from "path";

const userMessages = new Map<string, string>();
const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function cleanUserMessage(message: string): string {
  if (!message) return message;
  message = message.replace(/\\nAI:.*$/, "");
  message = message.replace(/"?\],"stream":true\}$/, "");
  message = message.replace(/"?\}].*$/, "");
  return message;
}

function extractUserMessage(body: string): string {
  try {
    const parsedBody = JSON.parse(body);
    let actualUserMessage = "";

    if (parsedBody.userMessage) {
      actualUserMessage = parsedBody.userMessage;
    } else if (parsedBody.prompt) {
      actualUserMessage = parsedBody.prompt;
    } else if (parsedBody.messages && Array.isArray(parsedBody.messages)) {
      for (let i = parsedBody.messages.length - 1; i >= 0; i--) {
        const message = parsedBody.messages[i];
        if (message.role === "user" && message.content) {
          actualUserMessage = message.content;
          break;
        }
      }
    }

    if (!actualUserMessage) {
      const conversationRegex = /Current conversation:[^]*Human: ([^\n]+)/;
      const match = body.match(conversationRegex);
      if (match && match[1]) {
        actualUserMessage = match[1];
      }
    }

    const cleaned = cleanUserMessage(actualUserMessage);
    return cleaned || "Empty message";
  } catch (error) {
    return "Error processing message";
  }
}

export function configureLogging(proxy: any): void {
  proxy.on("proxyReq", (proxyReq: any, req: any) => {
    const originalWrite = proxyReq.write;
    proxyReq.write = function (data: any) {
      if (data) {
        const body = data.toString();
        const clientIP =
          req.headers["cf-connecting-ip"] ||
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "unknown";

        const userMessage = extractUserMessage(body);
        const requestId = clientIP + "_" + Date.now();
        userMessages.set(requestId, userMessage);
        req.requestId = requestId;
      }

      return originalWrite.apply(proxyReq, arguments);
    };
  });

  proxy.on("proxyRes", (proxyRes: any, req: any) => {
    const clientIP =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    const requestId = req.requestId || clientIP + "_unknown";
    const responseChunks: string[] = [];
    let aiResponse = "";

    proxyRes.on("data", (chunk: Buffer) => {
      const chunkStr = chunk.toString();
      responseChunks.push(chunkStr);

      try {
        const jsonData = JSON.parse(chunkStr);
        if (jsonData.message?.content) {
          aiResponse += jsonData.message.content;
        }
      } catch (e) {}
    });

    proxyRes.on("end", () => {
      const userMessage = userMessages.get(requestId) || "Unknown user message";

      if (!aiResponse) {
        const fullResponse = responseChunks.join("");
        const jsonData = JSON.parse(fullResponse);
        if (jsonData.message?.content) {
          aiResponse = jsonData.message.content;
        }
      }

      const timestamp = new Date().toISOString();
      const logEntry = `
==================================================
DATE: ${timestamp}
Human: ${userMessage}
AI: ${aiResponse}`;

      const logFile = path.join(
        logsDir,
        `${clientIP.replace(/[^a-zA-Z0-9]/g, "_")}.txt`
      );
      fs.appendFileSync(logFile, logEntry);
      userMessages.delete(requestId);
    });
  });
}
