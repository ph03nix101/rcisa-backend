const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const ResponseMessages = require("../utils/ResponseMessages");

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
    const response = await authController.login(body, res);

    ResponseMessages.Success(res, response);
  }catch(error){
    ResponseMessages.Error(res, error);
  }
});

router.post('/refresh', async (req, res) => {
  try{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ResponseMessages.Error(res, 'Refresh Token Required.');
    }

    const response = await authController.getRefreshTokens(refreshToken, res);
    ResponseMessages.Success(res, response);
  } catch(error){
    ResponseMessages.Error(res, error);
  }
  
});

router.post("/logout", async(req, res) => {
  try{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return ResponseMessages.Error(res, 'No Refresh Token Found.');

    const response = authController.logout(refreshToken);

    res.clearCookie('refreshToken');
    ResponseMessages.Success(res, response);
  } catch(error){
    ResponseMessages.Error(res, error);
  }
});


module.exports = router;
