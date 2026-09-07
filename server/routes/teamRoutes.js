const express =
  require("express");

const multer =
  require("multer");

const path =
  require("path");

const fs =
  require("fs");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  fetchTeam,
  uploadResume,
  suggestMembers,
} =
  require("../controllers/teamController");

const router =
  express.Router();

const uploadFolder =
  path.join(
    __dirname,
    "../uploads"
  );

if (
  !fs.existsSync(
    uploadFolder
  )
) {
  fs.mkdirSync(
    uploadFolder,
    {
      recursive: true,
    }
  );
}

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        uploadFolder
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const safeName =
        file.originalname.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

      cb(
        null,
        `${Date.now()}-${safeName}`
      );
    },
  });

const upload =
  multer({
    storage,

    limits: {
      fileSize:
        5 *
        1024 *
        1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const extension =
        path
          .extname(
            file.originalname
          )
          .toLowerCase();

      const allowed = [
        ".pdf",
        ".docx",
        ".txt",
      ];

      if (
        allowed.includes(
          extension
        )
      ) {
        return cb(
          null,
          true
        );
      }

      return cb(
        new Error(
          "Only PDF, DOCX and TXT files are allowed"
        )
      );
    },
  });

router.get(
  "/",
  authMiddleware,
  fetchTeam
);

router.post(
  "/resume/:userId",
  authMiddleware,
  upload.single(
    "resume"
  ),
  uploadResume
);

router.post(
  "/suggest",
  authMiddleware,
  suggestMembers
);

module.exports =
  router;