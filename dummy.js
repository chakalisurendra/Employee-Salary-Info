


async function updateExperience(event) {
  try {
    const employeeId = event.pathParameters.employeeId;
    const requestBody = JSON.parse(event.body);
    console.log(requestBody)
    const params = {
      TableName: process.env.EMPLOYEE_TABLE,
      Key: {
        EmpId: employeeId,
      },
      UpdateExpression:
        "SET Experience_Info.CompanyName = :companyName, Experience_Info.CompanyLocation = :companyLocation," +
        "Experience_Info.StartDate = :startDate, Experience_Info.EndDate = :endDate, Experience_Info.PerformedRole = :performedRole," +
        "Experience_Info.Responsibilities = :responsibilities, Experience_Info.TechnologiesWorked = :technologiesWorked," +
        "Experience_Info.IsActive = :isActive",
      ExpressionAttributeValues: {
        ":companyName": requestBody.Experience_Info.CompanyName,
        ":companyLocation": requestBody.Experience_Info.CompanyLocation,
        ":startDate": requestBody.Experience_Info.StartDate,
        ":endDate": requestBody.Experience_Info.EndDate,
        ":performedRole": requestBody.Experience_Info.PerformedRole,
        ":responsibilities": requestBody.Experience_Info.Responsibilities,
        ":technologiesWorked": requestBody.Experience_Info.TechnologiesWorked,
        ":isActive": requestBody.Experience_Info.IsActive,
      },
    };
    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Record Updated Successfully...!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
}






///////////////////////////////////////////////////////////////////////////////////////



// const updateEmployeeSalary = async (event) => {
//     let response = { statusCode: 200 };
//     try {
//       // Parse the JSON body from the event
//       const body = JSON.parse(event.body);
//       const empId = event.pathParameters.empId;
  
//       const existingEmployee = await getEmployeeSalary(empId);
  
//       // Determine which fields to update
//       const objKeys = Object.keys(body);
//       const fieldsToUpdate = {};
//       objKeys.forEach((key) => {
//         if (body[key] !== undefined) {
//           fieldsToUpdate[key] = body[key];
//         }
//       });
  
//       // Perform validation on salaryDetails
//       const validationError = validation({ salaryDetails: fieldsToUpdate });
//       if (validationError) {
//         response.statusCode = 400;
//         response.body = JSON.stringify({
//           message: validationError,
//         });
//         throw new Error(validationError);
//       }
  
//       // Define parameters for updating an item in DynamoDB
//       const updateExpressionParts = [];
//       const expressionAttributeValues = {};
  
//       Object.keys(fieldsToUpdate).forEach((key, index) => {
//         updateExpressionParts.push(`#key${index} = :value${index}`);
//         expressionAttributeValues[`:value${index}`] = fieldsToUpdate[key];
//       });
  
//       const updateExpression = `SET ${updateExpressionParts.join(", ")}`;
  
//       const params = {
//         TableName: process.env.DYNAMODB_TABLE_NAME,
//         Key: marshall({ empId: event.pathParameters.empId }),
//         UpdateExpression: updateExpression,
//         ExpressionAttributeNames: fieldsToUpdate,
//         ExpressionAttributeValues: marshall(expressionAttributeValues),
//       };
  
//       // Update the item in DynamoDB
//       const updateResult = await client.send(new UpdateItemCommand(params));
//       response.body = JSON.stringify({
//         message: "Successfully updated salary.",
//         updateResult,
//       });
//     } catch (e) {
//       console.error(e);
//       response.body = JSON.stringify({
//         message: "Failed to update BankDetails!",
//         errorMsg: e.message,
//         errorStack: e.stack,
//       });
//     }
//     return response;
//   };