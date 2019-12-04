/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const stocks = ['tsla', 'amd'];

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
        chai.request(server)
          .get('/api/stock-prices?stock=tsla')
          .end((err, res) => {
            let { stockData } = res.body;
            assert.isObject(stockData, 'stockData is an object');
            assert.containsAllKeys(stockData, ['stock', 'price', 'likes']);
            assert.strictEqual('TSLA', stockData.stock, 'query stock is equal to stockData stock');
            assert.isNumber(stockData.likes, 'stock likes is a number');
            done();
          });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices?stock=tsla&like=true')
          .set('x-forwarded-for', '1.234.5.67')
          .end((err, res) => {
            let { stockData } = res.body;
            assert.isObject(stockData, 'stockData is an object');
            assert.containsAllKeys(stockData, ['stock', 'price', 'likes']);
            assert.strictEqual('TSLA', stockData.stock, 'query stock is equal to stockData stock');
            assert.isNumber(stockData.likes, 'stock likes is a number');
            assert.isAbove(stockData.likes, 0, 'likes are greater than 0');
            done();
          });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices?stock=tsla&like=true')
          .set('x-forwarded-for', '1.234.5.67')
          .end((err, res) => {
            let { stockData } = res.body;
            assert.isObject(stockData, 'stockData is an object');
            assert.containsAllKeys(stockData, ['stock', 'price', 'likes']);
            assert.strictEqual('TSLA', stockData.stock, 'query stock is equal to stockData stock');
            assert.isNumber(stockData.likes, 'stock likes is a number');
            assert.isBelow(stockData.likes, 2, 'like is not counted more than once');
            done();
          });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices?stock=tsla&stock=amd')
          .end((err, res) => {
            let { stockData } = res.body;
            let len = stockData.length;
            assert.isArray(stockData, 'stockData is an array');
            assert.strictEqual(len, 2, 'stockData has length of 2');
            assert.containsAllKeys(stockData[0], ['stock', 'price', 'rel_likes']);
            assert.containsAllKeys(stockData[1], ['stock', 'price', 'rel_likes']);
            assert.strictEqual('TSLA', stockData[0].stock, 'query stock is equal to stockData stock');
            assert.strictEqual('AMD', stockData[1].stock, 'query stock is equal to stockData stock');
            assert.isNumber(stockData[0].rel_likes, 'stock rel_likes is a number');
            assert.isNumber(stockData[1].rel_likes, 'stock rel_likes is a number');
            done();
          });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices?stock=tsla&stock=amd&like=true')
          .set('x-forwarded-for', '1.234.5.67')
          .end((err, res) => {
            let { stockData } = res.body;
            let len = stockData.length;
            let relA = stockData[0].rel_likes - stockData[1].rel_likes;
            let relB = stockData[1].rel_likes - stockData[0].rel_likes;
            assert.isArray(stockData, 'stockData is an array');
            assert.strictEqual(len, 2, 'stockData has length of 2');
            assert.containsAllKeys(stockData[0], ['stock', 'price', 'rel_likes']);
            assert.containsAllKeys(stockData[1], ['stock', 'price', 'rel_likes']);
            assert.strictEqual('TSLA', stockData[0].stock, 'query stock is equal to stockData stock');
            assert.strictEqual('AMD', stockData[1].stock, 'query stock is equal to stockData stock');
            assert.isNumber(stockData[0].rel_likes, 'stock rel_likes is a number');
            assert.isNumber(stockData[1].rel_likes, 'stock rel_likes is a number');
            assert.strictEqual(relA, stockData[0].rel_likes, 'stock 1 has correct relative likes');
            assert.strictEqual(relB, stockData[1].rel_likes, 'stock 2 has correct relative likes');
            done();
          });
      });
      
    });

});