const mongoClient = require("mongodb").MongoClient;

const state = {
  db: null,
};

module.exports.connect = function (done) {
  const url = "mongodb+srv://clientsvectorcrop:msb.com001@madrasathulfurqan-regis.ckhgtgy.mongodb.net/?retryWrites=true&w=majority&appName=Madrasathulfurqan-Registartion";
  const dbname = "Madrasathulfurqan-Registartion";

  mongoClient.connect(url, { useUnifiedTopology: true }, (err, data) => {
    if (err) {
      return done(err);
    }
    state.db = data.db(dbname);

    done();
  });
};

module.exports.get = function () {
  return state.db;
};
