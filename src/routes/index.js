const router = require('express').Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const visitorController = require('../controllers/visitor.controller');
const ResponseMessages = require("../utils/ResponseMessages");

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.post("/visit", async (req, res) => {
  try{
    let body = req.body;
    const response = await visitorController.addVisitor(body);
    ResponseMessages.Success(res, response);}
  catch(error){
    ResponseMessages.Error(res, error);
  }
});

module.exports = router;