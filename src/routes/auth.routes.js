const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const ResponseMessages = require("../utils/ResponseMessages");

// let refreshTokens = [];

router.post("/register", async (req, res) => {
  try{
    let body = req.body;
    const response = await authController.register(body);
    ResponseMessages.Success(res, response);}
  catch(error){
    ResponseMessages.Error(res, error);
  }
  

});

router.post("/login", async(req, res) => {
  try{
    let body = req.body;
    const response = await authController.login(body);
    ResponseMessages.Success(res, response);
  }catch(error){
    ResponseMessages.Error(res, error);
  }
});

// Implementing Later
// router.post("/logout", async(req, res) => {
//   try{

//   }
// })


module.exports = router;
