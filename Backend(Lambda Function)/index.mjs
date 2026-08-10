import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });// here region should be your region you are working
const TABLE_NAME = "CalcHistory";

export async function handler(event) {
  let payload = {};
  try {
    if (event.body) {
      payload = JSON.parse(event.body);
    } else {
      payload = event;
    }
  } catch (e) {
    payload = event;
  }

  const expression = payload.expression || "";
  const angleMode = payload.angleMode === 'RAD' ? 'RAD' : 'DEG'; // Default to DEG
  const ans = typeof payload.ans === 'number' ? payload.ans : 0;

  const state = { angleMode, ans };

  function toRadians(x) {
    return state.angleMode === 'DEG' ? x * Math.PI / 180 : x;
  }

  function fromRadians(x) {
    return state.angleMode === 'DEG' ? x * 180 / Math.PI : x;
  }

  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial only for non-negative integers");
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  function myLog10(x) { return Math.log10(x); }
  function myLn(x) { return Math.log(x); }
  function mySqrt(x) { return Math.sqrt(x); }

  function wrapFunctions(expr) {
    const functionMap = {
      'sin': x => `Math.sin(toRadians(${x}))`,
      'cos': x => `Math.cos(toRadians(${x}))`,
      'tan': x => `Math.tan(toRadians(${x}))`,
      'asin': x => `fromRadians(Math.asin(${x}))`,
      'acos': x => `fromRadians(Math.acos(${x}))`,
      'atan': x => `fromRadians(Math.atan(${x}))`,
      'cbrt': x => `Math.cbrt(${x})`,
      'log': x => `myLog10(${x})`,
      'ln': x => `myLn(${x})`,
      'abs': x => `Math.abs(${x})`,
      'floor': x => `Math.floor(${x})`,
      'ceil': x => `Math.ceil(${x})`,
      'round': x => `Math.round(${x})`
    };

    // Fixed regex with word boundary
    Object.keys(functionMap).forEach(fn => {
      const regex = new RegExp(`\\b${fn}\\s*\\(([^)]+)\\)`, 'gi');
      expr = expr.replace(regex, (match, arg) => functionMap[fn](arg.trim()));
    });
    return expr;
  }

  function transform(html) {
    let expr = html;

    // 1. HTML/superscript
    expr = expr.replace(/(\S+?)<sup>(.*?)<\/sup>/gi, (_, base, exp) => `${base}**(${exp})`);
    expr = expr.replace(/<\/?[^>]+>/g, "");

    // 2. Operators
    expr = expr.replace(/×/g, '*')
              .replace(/÷/g, '/')
              .replace(/\^/g, '**');

    // 3. wrapFunctions FIRST
    expr = wrapFunctions(expr);

    // 4. Constants SECOND
    expr = expr.replace(/\bpi\b/gi, 'Math.PI')
              .replace(/\be\b/g, 'Math.E')
              .replace(/\bans\b/gi, state.ans.toString());

    // 5. sqrt AFTER functions
    expr = expr.replace(/sqrt\s*\(\s*([^)]+)\s*\)/gi, 'mySqrt($1)');

    // 6. Other replacements
    expr = expr.replace(/(\d+)!/g, 'factorial($1)');
    expr = expr.replace(/(\d+)%/g, '($1/100)');
    expr = expr.replace(/(\d+)√(\d+(\.\d+)?)/g, 'Math.pow($2,1/$1)');

    return expr;
  }

  function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  try {
    if (!expression.trim()) throw new Error("Empty expression");

    const jsExpr = transform(expression.trim());
    const result = Function(
      "toRadians", "fromRadians", "factorial", "state", "myLog10", "myLn", "mySqrt",
      `return ${jsExpr}`
    )(
      toRadians, fromRadians, factorial, state, myLog10, myLn, mySqrt
    );

    // Handle NaN gracefully
    if (!Number.isFinite(result)) {
      result = NaN;
    }

    const rounded = Math.round(result * 1e12) / 1e12;

    const execDate = new Date();
    const execTimeFormatted = execDate.toISOString();
    const execTimeLocal = execDate.toLocaleTimeString('en-IN', { 
      hour12: true, 
      timeZone: 'Asia/Kolkata' 
    });

    // Save to DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: generateId() },
        expression: { S: expression },
        result: { N: rounded.toString() },
        angleMode: { S: state.angleMode },
        timestamp: { N: Date.now().toString() },
        execTimeIso: { S: execTimeFormatted },
        execTimeLocal: { S: execTimeLocal }
      }
    };
    await ddbClient.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
      },
      body: JSON.stringify({ result: rounded, status: "OK" }),
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "Error",
        message: e.message || "Internal error"
      }),
    };
  }
}
