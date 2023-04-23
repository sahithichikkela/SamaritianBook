const multer = require("multer");

const storage = multer.memoryStorage();

const uploadS3 = multer({ storage: storage });

module.exports = { uploadS3 };
