
export type SelectProduct = {
  id: string;
  imageUrl: string;
  name: string;
  status: string;
  price: number;
  stock: number;
  availableAt: Date;
};
export async function getProducts() {
  return {
    products: [
      {
        id: 'lorem',
        imageUrl: '',
        name: 'product 1',
        status: 'active',
        price: 2.00,
        stock: 1,
        availableAt: new Date(),
      },
      {
        id: 'lorem 2',
        imageUrl: '',
        name: 'product 2',
        status: 'active',
        price: 4.00,
        stock: 1,
        availableAt: new Date(),
      },
    ],
    newOffset: 0,
    totalProducts: 2
  };
}