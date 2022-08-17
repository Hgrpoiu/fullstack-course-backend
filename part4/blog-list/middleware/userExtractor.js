const jwt = require("jsonwebtoken");

function userExtractor(request,response,next){
    if (!request.token) {
        return response.status(401).json({
          error: "token is required",
        });
      }
      const decodedToken = jwt.verify(request.token, process.env.SECRET);
      const reqId = decodedToken.id;

    request.user=reqId.toString()
    next()
}

module.exports={userExtractor}