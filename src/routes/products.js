
const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {getAllProduct,getProduct,insertProduct,updateProduct,deleteProduct} = require('../controller/products')
const {protect} = require('../middlewares/auth')

router
  .get('/', getAllProduct)
  .get('/:id', protect, getProduct)
  .post('/', protect, upload.single('photo'), insertProduct)
  .put('/:id', protect, upload.single('photo'), updateProduct)
  .delete('/:id', protect, deleteProduct)

module.exports = router
