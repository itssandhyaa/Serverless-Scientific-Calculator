# 🧪 Calculator Lambda Test Suite

This file contains the top 12 most important test cases for verifying the Calculator Lambda function. Copy  only the **Input Event** directly into the AWS Lambda Console "Test" tab to verify functionality. Check your output with **Expected Output**.

## 🛠️ Top Test Cases (Copy & Paste)

### 1. Simple Addition
**Goal:** Basic arithmetic and JSON parsing.
**Input Event:**
```json
{
  "body": {
    "expression": "2+3",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
  },
  "body": "{\"result\":5,\"status\":\"OK\"}"
}
```
### 2. Superscript power
**Goal:** x<sup>y</sup> → x**(y).
**Input Event:**
```json
{
  "body": {
    "expression": "2<sup>3</sup>",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  
  "body": "{\"result\":8,\"status\":\"OK\"}"
}
```

### 3. PI Constant and Euler e Constant
**Goal:** "pi" -> **Math.PI** and "e" -> **Math.E** with diiferent arithematic operator.
**Input Event:**
```json
{
  "body": {
    "expression": "2*pi + e/2",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":7.642326221409,\"status\":\"OK\"}"
}
```

### 4. Factorial of integer
**Goal:** 5! → factorial(5).

**Input Event:**
```json
{
  "body": {
    "expression": "5!",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":120,\"status\":\"OK\"}"
}
```

### 5. N-th root notation
**Goal:** 3√8 → Math.pow(8,1/3).
**Input Event:**
```json
{
  "body": {
    "expression": "3√8",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":2,\"status\":\"OK\"}"
}
```

### 6. sin in DEG
**Goal:** DEG mode using toRadians.
**Input Event:**
```json
{
  "body": {
    "expression": "sin(30)",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":0.5,\"status\":\"OK\"}"
}
```

### 7. sin in RAD
**Goal:** RAG mode.
**Input Event:**
```json
{
  "body": {
    "expression": "sin(30)",
    "angleMode": "RAD",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":-0.988031624093,\"status\":\"OK\"}"
}
```
### 8. Nested functions
**Goal:** wrapFunctions handles nesting.
**Input Event:**
```json
{
  "body": {
    "expression": "sqrt(sin(30)^2+cos(60)^2)",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":0.707106781187,\"status\":\"OK\"}"
}
```

### 9. Log and ln
**Goal:** log10 and natural log.
**Input Event:**
```json
{
  "body": {
    "expression": "log(100)+ln(e)",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":3,\"status\":\"OK\"}"
}
```

### 10. abs, floor, ceil, round
**Goal:** verify all mapping.
**Input Event:**
```json
{
  "body": {
    "expression": "round(abs(-3.6))+floor(3.9)+ceil(3.1)",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "body": "{\"result\":11,\"status\":\"OK\"}"
}
```
### 11. Division by zero
**Goal:** Math Error for non-finite.
**Input Event:**
```json
{
  "body": {
    "expression": "10/0",
    "angleMode": "DEG",
    "ans": 0
  }
}
```
**Expected Output:**
```JSON
{
  "statusCode": 500,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"status\":\"Error\",\"message\":\"Math Error\"}"
}
```
### 12. Invalid AngleMode
**Goal:** It shows an invalid error
**Input Event:**
```json
{
  "body": {
    "expression": "sin(30)",
    "angleMode": "XYZ",
    "ans": 0
  }
}
```
**Expected Output:**
```json
{
  "errorType": "Error",
  "errorMessage": "Invalid angleMode",
  "trace": [
    "Error: Invalid angleMode",
    "    at file:///var/task/index.mjs:21:34",
    "    at Runtime.handler (file:///var/task/index.mjs:21:68)",
    "    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1306:29)"
  ]
}
```