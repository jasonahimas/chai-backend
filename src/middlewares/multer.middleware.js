import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // file is available from multer to handle files
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage }); // creates a multer middleware instance
