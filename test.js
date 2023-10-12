const { expect } = require("chai");
const awsSdkMock = require("aws-sdk-mock");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { createEmployeeSalary } = require("./api");

// Mock DynamoDBClient to avoid making actual AWS calls
const mockClient = {
  send: () => ({}),
};
// Mock employee data for createEmployee
const createEmployeeData = {
  empId: "1",
  salaryDetails: {
    PANCard: "JRKPS0367L",
    BasicMonthly: "23432.9",
    DAMonthly: "00",
    SpecialAllowanceMonthly: "1231.12",
    PFSharedMonthly: "2342.12",
    ESIShareMonthly: "00",
    DeductionsMonthly: "45645.12",
    NetPayMonthly: "3456.12",
    BasicYearly: "4566.12",
    DAYearly: "45634.12",
    SpecialAllowanceYearly: "3565.12",
    PFSharedYearly: "8989.9",
    ESIShareYearly: "8575.12",
    DeductionsYearly: "245234.00",
    NetPayYearly: "43546.12",
  },
};

const createEmployeeData1 = {
  salaryDetails: {
    PANCard: "JRKPS0367L",
    BasicMonthly: "23432.9",
    DAMonthly: "00",
    SpecialAllowanceMonthly: "1231.12",
    PFSharedMonthly: "2342.12",
    ESIShareMonthly: "00",
    DeductionsMonthly: "45645.12",
    NetPayMonthly: "3456.12",
    BasicYearly: "4566.12",
    DAYearly: "45634.12",
    SpecialAllowanceYearly: "3565.12",
    PFSharedYearly: "8989.9",
    ESIShareYearly: "8575.12",
    DeductionsYearly: "245234.00",
    NetPayYearly: "43546.12",
  },
};
// Successfully create an employee
// Successfully create an employee
describe("createEmployee unit tests", () => {
  let originalDynamoDBClient;
  before(() => {
    originalDynamoDBClient = DynamoDBClient;
    DynamoDBClient.prototype.send = () => mockClient.send();
  });
  after(() => {
    DynamoDBClient.prototype.send = originalDynamoDBClient.prototype.send;
  });
  it("successfully create an employee", async () => {
    // Mock event object with employee data
    // originalDynamoDBClient = DynamoDBClient;
    // DynamoDBClient.prototype.send = () => mockClient.send();
    let event = {
      body: JSON.stringify(createEmployeeData),
    };
    const response = await createEmployeeSalary(event);
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).to.equal(
      "Successfully created salaryDetails!"
    ); // Correct the message if necessary
  });
  it("fails to create an employee with missing data", async () => {
    // Mock event object with missing data

    let event = {
      body: JSON.stringify(createEmployeeData1), // Missing required data
    };
    const response = await createEmployeeSalary(event);
    expect(response.statusCode).to.equal(400); // Expecting an error response
    const responseBody = JSON.parse(response.body);
    //expect(responseBody.message).to.equal("Failed to update salaryDetails.");
    expect(responseBody.errorMsg).to.equal("empId is a mandatory field!");

  });
  // it("fails to create an employee with invalid data", async () => {
  //   // Mock event object with invalid data

  //   DynamoDBClient.prototype.send = async function (command) {
  //     throw new Error("Unexpected error");
  //   };
  //   let event = {
  //     body: JSON.stringify({}),
  //   };
  //   const response = await createEmployeeSalary(event);
    
  //   expect(JSON.parse(response.body)).to.deep.equal({
  //     statusCode : 500,
  //     message: "Failed to update salaryDetails.",
  //   });
  // });
});

