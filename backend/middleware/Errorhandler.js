module.exports = (request, response, next) => {
    try {
        next();
        return;
    } catch (error) {
        response.status(500).json({ error: error.message });
        return;
    }
}