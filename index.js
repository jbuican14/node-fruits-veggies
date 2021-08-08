// perform different action to different urls
// Create without using express

const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// Create a same way we create a server ch. 12 Routing

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Slugify
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }
  // product
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-custom-header': 'my custom header',
    });
    res.end('<h2>Page Not found</h2>');
  }
});

// Now listen the the server we create on port we define
server.listen(8080, '127.0.0.1', () => {
  console.log('Listening to requests on port 8080');
});
