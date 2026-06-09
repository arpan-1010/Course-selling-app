const { z } = require("zod");

const purchaseValidation = z.object({
    userId : z.string(),
    courseId : z.string()
});

module.exports = {
    purchaseValidation
};