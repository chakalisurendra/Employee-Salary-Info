const updateEmployeeSalary = async (event) => {
    let response = { statusCode: 200 };
    try {
      // Parse the JSON body from the event
      const body = JSON.parse(event.body);
      const empId = event.pathParameters.empId;
  
      const existingEmployee = await getEmployeeSalary(empId);
  
      // Determine which fields to update
      const objKeys = Object.keys(body);
      const fieldsToUpdate = {};
      objKeys.forEach((key) => {
        if (body[key] !== undefined) {
          fieldsToUpdate[key] = body[key];
        }
      });
  
      // Perform validation on salaryDetails
      const validationError = validation({ salaryDetails: fieldsToUpdate });
      if (validationError) {
        response.statusCode = 400;
        response.body = JSON.stringify({
          message: validationError,
        });
        throw new Error(validationError);
      }
  
      // Define parameters for updating an item in DynamoDB
      const updateExpressionParts = [];
      const expressionAttributeValues = {};
  
      Object.keys(fieldsToUpdate).forEach((key, index) => {
        updateExpressionParts.push(`#key${index} = :value${index}`);
        expressionAttributeValues[`:value${index}`] = fieldsToUpdate[key];
      });
  
      const updateExpression = `SET ${updateExpressionParts.join(", ")}`;
  
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ empId: event.pathParameters.empId }),
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: fieldsToUpdate,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
      };
  
      // Update the item in DynamoDB
      const updateResult = await client.send(new UpdateItemCommand(params));
      response.body = JSON.stringify({
        message: "Successfully updated salary.",
        updateResult,
      });
    } catch (e) {
      console.error(e);
      response.body = JSON.stringify({
        message: "Failed to update BankDetails!",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }
    return response;
  };