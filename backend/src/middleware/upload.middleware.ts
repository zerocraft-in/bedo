import multer from 'multer';
import path from 'path';

const storage =
  multer.diskStorage({
    destination: (
      _req,
      _file,
      cb
    ) => {
      cb(
        null,
        'uploads/'
      );
    },

    filename: (
      _req,
      file,
      cb
    ) => {
      const ext =
        path.extname(
          file.originalname
        );

      cb(
        null,
        `${Date.now()}${ext}`
      );
    },
  });

export const upload =
  multer({
    storage,

    limits: {
      fileSize:
        5 *
        1024 *
        1024,
    },

    fileFilter: (
      _req,
      file,
      cb
    ) => {
      const allowed =
        [
          'image/png',
          'image/jpeg',
          'image/webp',
        ];

      if (
        !allowed.includes(
          file.mimetype
        )
      ) {
        return cb(
          new Error(
            'Invalid file type'
          )
        );
      }

      cb(null, true);
    },
  });