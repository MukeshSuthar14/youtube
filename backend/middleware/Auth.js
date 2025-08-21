const jwt = require("jsonwebtoken");
const constants = require("../config/constants");

module.exports = (request, response, next) => {
    var token = request?.body?.token || request?.query?.token || request?.headers["authorization"];
    
    if (!token) {
        response.status(401).json({ message: "Authrization Token is missing!!!" });
        return;
    }
    try {
        const decoded = jwt.verify(token, constants.JWT_SECRET_KEY);
        decoded.token = token;
        request.user = decoded;
    } catch (error) {
        response.status(500).json({ error: error.message });
        return;
    }
    next();
    return;
}
