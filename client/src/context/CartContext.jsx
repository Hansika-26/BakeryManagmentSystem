import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('bakeryCart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage and update totals whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('bakeryCart', JSON.stringify(cartItems));

        // Calculate total count
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);

        // Calculate total price
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cartItems]);

    // Add item to cart
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                // Increase quantity if item exists
                toast.success(`Added another ${product.name} to cart`);
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item
                toast.success(`${product.name} added to cart`);
                return [...prevItems, {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const item = prevItems.find(item => item._id === productId);
            if (item) {
                toast.info(`${item.name} removed from cart`);
            }
            return prevItems.filter(item => item._id !== productId);
        });
    };

    // Update item quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Increase quantity
    const increaseQuantity = (productId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (productId) => {
        setCartItems(prevItems => {
            const item = prevItems.find(item => item._id === productId);
            if (item && item.quantity === 1) {
                return prevItems.filter(item => item._id !== productId);
            }
            return prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
        });
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('bakeryCart');
        toast.info("Cart cleared");
    };

    // Get cart items formatted for order
    const getCartForOrder = () => {
        return cartItems.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));
    };

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartForOrder
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for using cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};
