const Product = require('../models/Product');

module.exports = class ProductViewModel {
    // Get all products with pagination
    static async getAllProducts(page = 1, limit = 10, search = '', category = '') {
        try {
            const skip = (page - 1) * limit;

            // Build query
            const query = { isActive: true };

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } },
                    { barcode: { $regex: search, $options: 'i' } }
                ];
            }

            if (category) {
                query.category = category;
            }

            const products = await Product
                .find(query)
                .populate('category', 'name')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });

            const total = await Product.countDocuments(query);

            return {
                success: true,
                data: products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Get Products Error: ${error.message}`);
        }
    }

    // Get single product
    static async getProductById(id) {
        try {
            const product = await Product
                .findById(id)
                .populate('category', 'name description');

            if (!product) {
                throw new Error('Product not found');
            }

            return {
                success: true,
                data: product
            };
        } catch (error) {
            throw new Error(`Get Product Error: ${error.message}`);
        }
    }

    // Create product
    static async createProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();

            return {
                success: true,
                message: 'Product created successfully',
                data: product
            };
        } catch (error) {
            throw new Error(`Create Product Error: ${error.message}`);
        }
    }

    // Update product
    static async updateProduct(id, updateData) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('category');

            if (!product) {
                throw new Error('Product not found');
            }

            return {
                success: true,
                message: 'Product updated successfully',
                data: product
            };
        } catch (error) {
            throw new Error(`Update Product Error: ${error.message}`);
        }
    }

    // Delete product (soft delete)
    static async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );

            if (!product) {
                throw new Error('Product not found');
            }

            return {
                success: true,
                message: 'Product deleted successfully'
            };
        } catch (error) {
            throw new Error(`Delete Product Error: ${error.message}`);
        }
    }

    // Get low stock products
    static async getLowStockProducts() {
        try {
            const products = await Product.aggregate([
                {
                    $match: {
                        isActive: true,
                        $expr: { $lte: ['$quantity', '$minStockLevel'] }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category'
                },
                {
                    $sort: { quantity: 1 }
                }
            ]);

            return {
                success: true,
                data: products,
                count: products.length
            };
        } catch (error) {
            throw new Error(`Get Low Stock Error: ${error.message}`);
        }
    }
}
