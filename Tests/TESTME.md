# Lambda Test Events

Copy-paste these JSON files directly into AWS Lambda console Test tab.

## Usage
1. Open Lambda function
2. Click "Test" tab
3. Create new test event
4. Copy JSON from any file in this folder
5. Run test

# API Testing
we can test the API using API gateway or Postman.

 ## In postman:

1. Change the method downdropdown on the left of url bar to **POST**.
2. Paste your **API Endpoint URL** (e.g., https://api-id.execute-api.region.amazonaws.com/prod/calculate).
3. click the **Body** tab below the url bar.
4. select the **Raw** radio button.
5. In the dropdown on the right, change **Text to JSON**.
6. Paste the content/event of your body object here in the body. 
  Example:
  ``` JSON
      {
        "expression": "2+3",
        "angleMode": "DEG",
        "ans": 0
      }
  ```
7. Click **SEND**. 

## In AWS APIGateway:

1. Log in to the AWS Console and go to **API Gateway**.
2. Select your API.
3. In the left sidebar, click on **Resources**.
4. Select your **POST** method.
5. Click the **Test** tab (it usually has a lightning bolt ⚡ icon).
6. In the Test screen, you will see a field for the Request Body.
Example:
 For your "Simple Addition" test: Paste only the inner data (the actual payload) into the Request Body box:      
``` JSON
      {
        "expression": "2+3",
        "angleMode": "DEG",
        "ans": 0
      }
  ```
7. Click the blue **Test** button.
