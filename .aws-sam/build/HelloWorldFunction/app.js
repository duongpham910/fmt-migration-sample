const im = require('imagemagick');
const fs = require('fs');
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  console.log(event.body)

  return sendRes(200, 'Response: xin chao the gioi')
};

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: body
  };
  return response;
}

const operate = async (body) => {
  const customArgs = body.customArgs.split(',') || [];
  let outputExtension = 'png';
  let inputFile = null, outputFile = null;

  try {
    if (body.base64Image) {
      inputFile = '/tmp/inputFile.png';
      const buffer = new Buffer(body.base64Image, 'base64');
      fs.writeFileSync(inputFile, buffer);
      customArgs.unshift(inputFile); // customArgs should be like [inputFile, options, outputfile]
    }

    outputFile = `/tmp/outputFile.${outputExtension}`;
    customArgs.push(outputFile);

    await performConvert(customArgs);
    let fileBuffer = new Buffer(fs.readFileSync(outputFile));
    fs.unlinkSync(outputFile);
    return sendRes(200, '<img src="data:image/png;base64,' + fileBuffer.toString('base64') + '"//>');

  } catch (e) {
    console.log(`Error:${e}`);
    return sendRes(500, e);
  }
}

const performConvert = (params) => {
  return new Promise(function (res, rej) {
    im.convert(params, (err) => {
      if (err) {
        console.log(`Error${err}`);
        rej(err);
      } else {
        res('operation completed successfully');
      }
    });
  });
}
