import CategoryService from "../services/category.service.js";

class CategoryController {
    static async getAllCategories(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    static async getCategoryById(req, res, next) {
        try {
            const { id } = req.params;
            const categoryId = +id;
            const category = await CategoryService.getCategoryById(categoryId);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ message: 'Category not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    static async createCategory(req, res, next) {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        try {
            const newCategory = await CategoryService.createCategory({ name, description });
            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req, res, next) {
        const { id } = req.params;
        const categoryId = +id;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        try {
            const updatedCategory = await CategoryService.updateCategory(categoryId, { name, description });
            if (updatedCategory) {
                res.status(200).json(updatedCategory);
            } else {
                res.status(404).json({ message: 'Category not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const categoryId = +id;
            const result = await CategoryService.deleteCategory(categoryId);
            if (result) {
                res.status(200).json({ message: 'Category deleted successfully' });
            } else {
                res.status(404).json({ message: 'Category not found' });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;