const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const router = require("express").Router();
const fs = require('fs');

const modifyJSON = () => {

}
router.post('/', (req, res) => {
    let products = fs.readFileSync('products.json');
    let productsList = JSON.parse(products);
   productsList['products'] = productsList.products.map((item) => {
            item['title'] = item['productName'];
            delete item['productName'];
       fs.watchFile('products.json', (curr, prev) => {
           console.log("Product Updated: " + item);
       })
            return item;
        });
    fs.writeFile("products.json", JSON.stringify(productsList), (err) => {
        console.log(err)
    })

})

module.exports = router;
