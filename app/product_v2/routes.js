const router = require('express').Router();
const Product = require('./model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads' });

router.post('/product', upload.single('image'), async (req, res) => {
  const { user_id, name, price, stock, status } = req.body;
  const image = req.file;
  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    try {
      await Product.sync();
      const result = await Product.create({ user_id, name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}` });
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }
});

router.get('/product', async (req, res) => {
  try {
    let product = await Product.findAll();
    if (product.length > 0) {
      res.status(200).json({
        message: 'Get Semua Method Model Product',
        data: product,
      });
    } else {
      res.status(200).json({
        message: 'Tidak ada data',
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    let product = await Product.findAll({
      where: {
        id: req.params.id,
      },
    });
    if (product.length > 0) {
      res.status(200).json({
        message: 'ID ditemukan',
        data: product,
      });
    } else {
      res.status(200).json({
        message: 'Id tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

router.put('/product/:id', async (req, res) => {
  try {
    let product = await Product.update(
      {
        user_id: req.body.user_id,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({
      message: 'Berhasil ubah data',
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

router.delete('/product/:id', async (req, res) => {
  try {
    let product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'Berhasil Hapus data',
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

module.exports = router;
