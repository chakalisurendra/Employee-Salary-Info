// This program is for getting the employee bank details based http GET method.
const {
  DynamoDBClient, // Dynamodb instance
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb"); //aws-sdk is used to build rest APIs
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb"); // Importing marshall, unmarshall for Convert a JavaScript object into a DynamoDB record and a DynamoDB record into a JavaScript object
const client = new DynamoDBClient(); // Create new instance of DynamoDBClient to client, will use this constant across the program

// Define regular expressions for validation
//validatins for amount
//const amount = /^\d*(\.\d{2})?$/;
const amount = /^\d+(\.\d{2})?$/;

const PANCardNumber = /^[A-Z]{5}[0-9]{4}[A-Z]$/;


// Validation function for salaryDetails object
const validation = (salaryDetails) => {
  //amount validation the fields
  if (!amount.test(salaryDetails.BasicMonthly) || !amount.test(salaryDetails.DAMonthly) || !amount.test(salaryDetails.SpecialAllowanceMonthly) || 
  !amount.test(salaryDetails.PFSharedMonthly) || !amount.test(salaryDetails.ESIShareMonthly) || !amount.test(salaryDetails.DeductionsMonthly) || 
  !amount.test(salaryDetails.NetPayMonthly) || !amount.test(salaryDetails.BasicYearly) || !amount.test(salaryDetails.DAYearly) || 
  !amount.test(salaryDetails.SpecialAllowanceYearly) || !amount.test(salaryDetails.PFSharedYearly) || !amount.test(salaryDetails.ESIShareYearly) || 
  !amount.test(salaryDetails.DeductionsYearly) || !amount.test(salaryDetails.NetPayYearly)) {
    return "Please enter numbers only for the amount, ensuring exactly two decimal places for Piases!";
  }
  //PANCardNumber 
  if (!PANCardNumber.test(salaryDetails.PANCard)) {
    return "Please enter a valid PAN card format, which consists of five letters, followed by four digits, and ending with a single letter, like ABCDE1234F";
  }
  
  //return null; // Validation passed
};

// Function to create an employee
const createEmployeeSalary = async (event) => {
  let response = { statusCode: 200 };
  try {
    // Parse the JSON body from the event
    const body = JSON.parse(event.body);
    const salaryDetails = body.salaryDetails;
    console.log(salaryDetails);
    salaryDetails.CreatedDateTime = new Date().toISOString(); 
    salaryDetails.UpdatedDateTime = new Date().toISOString(); 
    salaryDetails.IsActive = true; 
    // Perform validation on salaryDetails
    const validationError = validation(salaryDetails);
    if (validationError) {
      response.statusCode = 400;
      response.body = JSON.stringify({
        message: validationError,
      });
      throw new Error(validationError);
    }
    //Check for required fields in the body
    const requiredSalaryDetails = [
      "PANCard",
      "BasicMonthly",
      "DAMonthly",
      "SpecialAllowanceMonthly",
      "PFSharedMonthly",
      "ESIShareMonthly",
      "DeductionsMonthly",
      "NetPayMonthly",
      "BasicYearly",
      "DAYearly",
      "SpecialAllowanceYearly",
      "PFSharedYearly",
      "ESIShareYearly",
      "DeductionsYearly",
      "NetPayYearly",
    //   "IsActive",
    //   "CreatedDateTime",
    //   "UpdatedDateTime",
    ];
    //Iterate salary Details to check mandatory fields
    for (const field of requiredSalaryDetails) {
      if (!body.salaryDetails[field]) {
        response.statusCode = 400;
        throw new Error(`${field} is a mandatory field!`);
      }
    }
    //empId should be given mandatory
    if (!body.empId) {
      response.statusCode = 400;
      throw new Error("empId is a mandatory field!");
    }
    // Define parameters for inserting an item into DynamoDB
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      //add the below line in params to validate post method to restrict duplicate posts
      //ConditionExpression: "attribute_not_exists(empId)",
      Item: marshall({
        empId: body.empId,
        salaryDetails: {
          PANCard: salaryDetails.PANCard,
          BasicMonthly: salaryDetails.BasicMonthly,
          DAMonthly: salaryDetails.DAMonthly,
          SpecialAllowanceMonthly: salaryDetails.SpecialAllowanceMonthly,
          PFSharedMonthly: salaryDetails.PFSharedMonthly,
          ESIShareMonthly: salaryDetails.ESIShareMonthly,
          DeductionsMonthly: salaryDetails.DeductionsMonthly,
          NetPayMonthly: salaryDetails.NetPayMonthly,
          BasicYearly: salaryDetails.BasicYearly,
          DAYearly: salaryDetails.DAYearly,
          SpecialAllowanceYearly: salaryDetails.SpecialAllowanceYearly,
          PFSharedYearly: salaryDetails.PFSharedYearly,
          ESIShareYearly: salaryDetails.ESIShareYearly,
          DeductionsYearly: salaryDetails.DeductionsYearly,
          NetPayYearly: salaryDetails.NetPayYearly,
          IsActive: salaryDetails.IsActive,
          CreatedDateTime: salaryDetails.CreatedDateTime,
          UpdatedDateTime: salaryDetails.UpdatedDateTime,
        },
      }),
    };
    // Insert the item into DynamoDB
    await client.send(new PutItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully created salaryDetails!",
    });
  } catch (e) {
    // To through the exception if anything failing while creating salaryDetails
    console.error(e);
      console.error(e);
      response.body = JSON.stringify({
        message: "Failed to update salaryDetails.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
  }
  return response;
};

module.exports = {
  createEmployeeSalary,
}; // exporting the function


//////////////////////////////////////////////////////////////////////////////////////////////
// user for update
// if (salaryDetails.IsActive !== true && salaryDetails.IsActive !== false) {
//     response.statusCode = 400;
//     response.body = JSON.stringify({
//       message: "isActive should be either true or false.",
//     });
//     throw new Error("isActive should be either true or false.");
//   }