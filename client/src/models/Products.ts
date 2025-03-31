export interface Product {
    product_id: number;
    name: string;
    description: string;
    category_id:number;
    quantity: number;
    price: number;
    img: string;
    created_at: Date;
    updated_at: Date;
}