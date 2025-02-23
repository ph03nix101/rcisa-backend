const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");
const ResponseMessages = require("../utils/ResponseMessages");
router.use(authenticateToken);


router.get("/getUserById", async (req, res, next) => {
    const user = req.body;
try{
    // let response = await UserController.getUserById(user);
    // ResponseMessages.Success(res, response);
    ResponseMessages.Success(res, "User found");

}catch(error){
    ResponseMessages.Error(res, error);
}

});
router.post("/createUser", async(req, res, next) => {
    const body = req.body;
    try{
        let response = await UserController.createUser(body);
        ResponseMessages.Success(res, response);
    }catch(error){
        ResponseMessages.Error(res, error);
    }
});

module.exports = router;
