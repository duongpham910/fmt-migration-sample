const XlsxPopulate = require('xlsx-populate');
let response;

exports.lambdaHandler = async (event, context) => {
  console.log("123123")

  return await XlsxPopulate.fromFileAsync("./abc.xlsm")
    .then(workbook => {
        // Modify the workbook.
        const value = workbook.sheet("表紙").cell("B14").value();
        // Log the value.
        console.log(value)

        return sendRes(200, 'pong-2');
    });

  return sendRes(200, 'pong-1');
};

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "text/html"
    },
    body: body
  };
  return response;
}
