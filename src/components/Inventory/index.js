import React from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

const InventoryPage = () => (
  <div>
    <InventoryList />
  </div>
);

var unsubscribe = null;

class InventoryListBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      products: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.onLoad();
  }
  onLoad = () => {
    let products = [];
    this.props.firebase
      .allProducts()
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          products.push(doc.data());
        });
      })
      .then(() => {
        this.setState({ products });
        this.setState({ loading: false });
      })
      .then(() => {
        unsubscribe = this.props.firebase
          .allProducts()
          .onSnapshot(querySnapshot => {
            console.log('db-updated');
            products = [];
            querySnapshot.forEach(doc => {
              console.log(doc.data());
              products.push(doc.data());
            });
            this.setState({ products });
          });
      });
  };

  componentWillUnmount() {
    unsubscribe();
  }

  render() {
    const { products, loading } = this.state;
    return (
      <div>
        {loading ? <p>Loading...</p> : <ProductList products={products} />}
      </div>
    );
  }
}

const ProductList = ({ products }) => (
  <table>
    <thead>
      <tr>
        <th>Product name</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      {console.log(products)}
      {products.map(product => (
        <tr>
          <td>
            <p>{product.name}</p>
          </td>
          <td>
            <p>{product.count}</p>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const InventoryList = compose(withFirebase)(InventoryListBase);

export default InventoryPage;