const stockSearch = require("../controllers/stockSearch");
const oneStock = require("../controllers/oneStock");
const twoStock = require("../controllers/twoStock");
const recents = require("../controllers/recents");
const updateLikes = require("../controllers/updateLikes");
const userIP = require("../controllers/userIP");


module.exports = (app, db) => {
  //serve root
  app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

  //home
  app.get("/api/stock-recents", (req, res) => {
    let recSearch = recents.searched(db.collection("stocks_recents"));
    let userLikes = recents.ipLikes(userIP(req), db.collection("stocks"));

    Promise.all([recSearch, userLikes])
      .then(data =>
        res.status(200).json({ recents: data[0], ipLikes: data[1] })
      )
      .catch(err => console.log("Error: ", err));
  });

  //stock data
  app.get("/api/stock-prices", (req, res) => {
    recents.upsert(req.query.stock, db.collection("stocks_recents"));

    let args = [
      req.query.stock,
      req.query.like,
      userIP(req),
      db.collection("stocks")
    ];

    let stockTask = Array.isArray(req.query.stock)
      ? twoStock(...args)
      : oneStock(...args);

    stockTask
      .then(stockData => res.status(200).json(stockData))
      .catch(err => res.status(500).json(err));
  });

  //front-end like update
  app.put("/api/stock-prices", (req, res) => {
    let args = [
      req.query.stock,
      req.query.like,
      userIP(req),
      db.collection("stocks")
    ];

    let mssg = {
      success: { show: true, success: "Stock likes updated!" },
      fail: { show: true, danger: "Something happened, try again" }
    };

    updateLikes(...args)
      .then(upd => {
        if (upd.ok || upd[0].ok) {
          return res.status(200).json(mssg.success);
        }

        return res.status(500).json(mssg.fail);
      })
      .catch(err => res.status(500).json(err));
  });

  //dynamic dropdown front-end user search
  app.get("/api/stock-search", (req, res) => stockSearch(req.query.stock, res));

  app.use((req, res) => res.status(404).send("Not Found"));
};
