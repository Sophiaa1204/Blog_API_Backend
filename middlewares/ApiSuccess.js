module.exports = (req, res, next) => {
    res.success = function(data, message, code= 200) {
        return res.json({
            code,
            data,
            message
        })
    }
}

//res.send([body]): Sends a response of various types. The body parameter can be a Buffer object, a String, an object, or an Array.