const { z } = require("zod");

const userSignInValidation = z.object({
    email : z.string().email(),
    password : z.string().min(8)
});

module.exports = {
    userSignInValidation
}