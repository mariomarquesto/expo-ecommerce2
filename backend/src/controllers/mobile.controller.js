// backend/controllers/product.controller.js
export const getMobileProducts = async (req, res) => {
  try {
    // .find() returns an array of all documents in the collection
    const products = await Product.find(); 

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};