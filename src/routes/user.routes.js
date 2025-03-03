const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");
const ResponseMessages = require("../utils/ResponseMessages");
router.use(authenticateToken);


router.get("/getUserById/:id", async (req, res, next) => {
    const { id } = req.params;
    console.log("=> getUsersById");
    try{
        let response = await UserController.getUserById(id);
        ResponseMessages.Success(res, response);

    }catch(error){
        ResponseMessages.Error(res, error);
    }
});


router.get("/getUsersByStatus/:status", async (req, res, next) => {
    const { status } = req.params;
    console.log("=> getUsersByStatus");
    try{
        let response = await UserController.getUsersByStatus(status);
        ResponseMessages.Success(res, response[0]);

    }catch(error){
        ResponseMessages.Error(res, error);
    }
});


router.get("/getUsersByNullStatus", async (req, res, next) => {
    console.log("=> getUsersByNullStatus");
    try{
        let response = await UserController.getUsersByNullStatus();
        ResponseMessages.Success(res, response[0]);

    }catch(error){
        ResponseMessages.Error(res, error);
    }
});


router.get("/getAllUsers", async (req, res, next) => {
    console.log("=> getAllUsers");
    try{
        let response = await UserController.getAllUsers();
        console.log('res: ',response)
        ResponseMessages.Success(res,response[0]);

    }catch(error){
        ResponseMessages.Error(res, error);
    }
    });


router.post("/createUser", async(req, res, next) => {
    const body = req.body;
    console.log("=> createUser");
    try{
        let response = await UserController.createUser(body);
        ResponseMessages.Success(res, response);
    }catch(error){
        ResponseMessages.Error(res, error);
    }
});


module.exports = router;
