
export interface OrderDetail {
    service: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number
}

export interface ShopOrder {
  shop: string;
  items: OrderDetail[];
}
