import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be a string"),
    body("description")
        .exists()
        .withMessage("Description Configuration is required"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price Configuration is required"),
    body("attributes").exists().withMessage("Attributes field is required"),
    body("tenantId").exists().withMessage("Tenant ID field is required"),
    body("categoryId").exists().withMessage("Category ID field is required"),
];
