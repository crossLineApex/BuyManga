import React ,{ useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Products from './components/Products/Products';
import Cart from "./components/Cart/Cart"
import Navbar from "./components/Navbar/Navbar";
import Checkout from "./components/CheckoutForm/Checkout/Checkout"
import { commerce } from './lib/commerce';

const App = () =>{

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});



  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    console.log(data);//gives the total products in the store
    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);

    setCart(item.cart);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    setCart(response.cart);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove(lineItemId);

    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout =  () => {
       refreshCart();  
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <Router>
    <div style = {{display: "flex"}}>
      <Navbar totalItems={cart.total_items}/>
      <Switch>
        <Route exact path = "/">
      <Products products={products} onAddToCart={handleAddToCart}/>
      </Route>
      <Route exact path = "/cart">
        <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart} />
      </Route>
      <Route exact path = "/checkout">
        <Checkout cart={cart} onCaptureCheckout={handleCaptureCheckout}/>
      </Route>
      </Switch>
    </div>
    </Router>
  )
}
export default App;