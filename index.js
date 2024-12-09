const fs = require('fs');
const http = require('http');
const { URL } = require('url');
const slugify = require('slugify');

// BLOCKING FUNCTION SAMPLE
// const textData = fs.readFileSync("starter/txt/input.txt", "utf-8");
// console.log(`Here is the content of the file: ${textData}`);

// const textNewdataFile = `about AVOCADO ${textData}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("starter/txt/new-data.txt", textNewdataFile);
// console.log(`NEW FILE WAS WRITTEN! with the content: ${textNewdataFile}`);

// Synchronous (codes are processed line by line also known as "Blocking Code" the previous code needs to successfully run first before the next code runs)
// Asynchronous (Off load heavy working code to the background which gives way to the next code to run right away also known as Non-Blocking Code)

///SERVER

// const PORT = 8000;

// const server = http.createServer((req, res) => {
//   console.log(req.url);

//   const pathName = req.url;

//   if (pathName === "/overview") {
//     res.end("Overview Page");
//   } else if (pathName === "/create") {
//     res.end("Create Page");
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "Own-Header": "Fuck OFF!",
//     });
//     res.end("<h1>PAGE NOT FOUND</h1>");
//   }
// });

// server.listen(PORT, "127.0.0.1", () => {
//   console.log(`Listening to request on port ${PORT}`);
// });

///SIMPLE API

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ORIGIN%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%BACK%}/g, '/overview');
  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);

const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');

const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);

  //OVERVIEW PAGE LOGIC
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //PRODUCT PAGE LOGIC
  } else if (pathname === '/product') {
    const product = dataObj[searchParams.get('id')];
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTemplate(tempProduct, product);
    console.log(searchParams.get('id'));
    console.log(product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //ERROR NOT FOUND HANDER
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'Own-Header': 'JUST A TEST',
    });
    res.end('<h1>PAGE NOT FOUND</h1>');
  }
});

const PORT = 8000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening to request on port ${PORT}`);
  console.log(__dirname);
});
