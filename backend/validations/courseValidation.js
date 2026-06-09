const { z } = require("zod");

const courseValidation = z.object({
    title : z.string().min(1),
    description : z.string().min(1),
    price: z.coerce.number().nonnegative(),
    imageUrl : z.string().url()
});

module.exports = {
    courseValidation
};