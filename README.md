# 📘 Serverless Scientific Calculator 

This project is a serverless scientific calculator built using HTML, CSS, and JavaScript on the frontend, and AWS services on the backend. The calculator sends user input to an API Gateway endpoint, which triggers an AWS Lambda function that processes all scientific calculations. The results are returned to the frontend, and each calculation is stored in DynamoDB for history tracking. The entire application is hosted and deployed using AWS Amplify, making it fast, scalable, and easy to manage.

This project demonstrates how to connect a simple UI to a fully serverless backend using core AWS services.
 
## 🚀 Features 

 - **Scientific Calculations:** Supports trigonometric functions, logarithms, exponentiation, square roots, percentages, factorials, and other advanced operations.

 - **Serverless Backend:** All calculations are processed inside an AWS Lambda function, ensuring high performance without managing servers.

 - **API-Driven Architecture:** Uses AWS API Gateway to securely expose the backend as a REST API that the frontend can call.

 - **Calculation History:** Every expression and its result are stored in DynamoDB, allowing retrieval of past calculations.

 - **Cloud Hosting:** The frontend (HTML, CSS, JS) is hosted through AWS Amplify for fast, reliable, and globally accessible deployment.

 - **Scalable & Low-Cost:** Because the project is serverless, it automatically scales with traffic and costs almost nothing to run for small workloads.

 - **Responsive Interface:** Designed to work smoothly across desktop and mobile devices with a clean, simple UI.

## 🛠️ Tech Stack
 ### Frontend
 - **HTML5 –** Structure for the calculator interface
 - **CSS3 –** Styling and layout
 - **JavaScript –** Handles UI logic and API calls
 - **VS Code –** Main code editor used for development

 ### Backend
 - **AWS Lambda –** Executes all scientific calculation logic
 - **AWS API Gateway –** Provides REST API endpoints for the frontend
 - **AWS DynamoDB –** Stores calculation history and results

 ### Deployment & Hosting
 - **AWS Amplify –** Hosts and deploys the frontend application
 - **Amazon S3 (via Amplify) –** Stores and serves frontend assets

 ### Other Tools
 - **Git & GitHub –** Version control and code management
 - **IAM Roles –** Secure access permissions between Lambda and DynamoDB

## 📁 Project Structure
```
/frontend
  ├── index.html       # Contains the main FrontEnd page
  ├── style.css        
  ├── script.js
/backend
  ├── CalculatorFunc.js (or index.mjs)  # Lambda Function or the backend logic
  ├── DynamoDB table setup
  ├──APIGateway Connection(RESTAPI)
/Deploy
  ├── Git & Github         # For code management and CI/CD Pipelines
  ├── AWS Amplify          #For hosting and Deploying
```
## ⚙️ How It Works (Architecture)

1. **User performs a calculation** on the frontend.
2. The frontend sends a request to **API Gateway endpoint**.
3. API Gateway triggers the **Lambda function**.
4. Lambda processes the calculation and stores data in **DynamoDB**.
5. Response returns to the UI and displays the result.
6. The entire UI is hosted and deployed via **AWS Amplify**.

## Deployment Architecture
![AWS Architecture](images/architecture.png)

## 🚀 Getting Started

To set up and run the application locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    https://github.com/itssandhyaa/Serverless-Scientific-Calculator.git
    ```

2. **Navigate to the  directory:**

   ```bash
   cd Serverless-Scientific-Calculator 
   ```
3. **Frontend Setup:**

  Just open **`index.html`** in the browser to run locally.  

4. **Backend Setup (Lambda + API Gateway):**

  1. Go to **AWS Lambda → Create Function**
  2. Upload your backend code
  3. Lambda permissions for DynamoDB (if using history)
  4. Create **API Gateway REST API**
  5. Connect Lambda to the POST/GET routes
  6. Deploy the API
  7. Copy the API Gateway URL and update in script.js:

  ```javascript
  // Replace the YOUR_API_GATEWAY_URL with your actual Invoke URL from your AWS API Gateway
  const API_URL = "YOUR_API_GATEWAY_URL";
  ```

5.  **Create DynamoDB Table:**

 1. Go to **AWS DynamoDB → Create table**
 2. Table name: **CalculatorHistory** // Write your own table name
 3. Partition key: **id (String)**
 4. Keep other settings as default
 5. Click **Create**

6. **Setup IAM permissions:**

 Your Lambda function needs permission to read and write to DynamoDB.
   1. Go to **Lambda Function → Configuration**
   2. Go to permissions and click  the **role attached to your Lambda function**.
   3. Click **Add permissions → create inline policy**.
   4. Add the JSON code:

   ```json
  {
   "type": "inline",
   "name": "CalcHistoryDynamoDBAccess",
    "Version": "2012-10-17",
   "Statement": [
     {
        "Sid": "CalcHistoryDynamoDBAccess",
        "Effect": "Allow",
        "Action": [
            "dynamodb:PutItem",
            "dynamodb:DeleteItem",
            "dynamodb:GetItem",
            "dynamodb:Scan",
            "dynamodb:Query",
            "dynamodb:UpdateItem"
        ],
        "Resource": "YOUR-TABLE-ARN" 
     }
    ]
  }
  ``` 
  
7. **Deploying With AWS Amplify**

 1. Go to **AWS Amplify Console**
 2. Select **Host a Web App**
 3. Connect your **GitHub Repository**
 4. Choose **branch → Deploy**
 5. Amplify will:
 - Build frontend
 - Create S3 bucket
 - Deploy your site
 - Provide live URL


## 📸 Screenshots

### UI Preview
![Calculator UI](images/calculator.png)

### Deployment Architecture
![AWS Architecture](images/architecture.png)


## 📚 Future Enhancements

- Add user authentication (Cognito)
- Store full calculation history
- Add dark mode
- Add unit converters

## 🌐 Live Demo

👉  **Live Website:** [Open App](https://your-live-website-url.com)  
👉 **API Endpoint:** https://abcdefghij.execute-api.ap-south-1.amazonaws.com/prod/calculator


## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📄 License

This project is open source under the MIT License.

   





 