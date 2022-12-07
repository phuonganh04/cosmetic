import { useState, useEffect } from "react";
import axiosClient from "../components/common-component/apis";

export const useFetchProduct = () => {
	const [products, setProducts] = useState<any>([]);
    
	useEffect(() => {
		axiosClient.get("/products").then(response => setProducts(response?.data || []));
	}, [])
    
	return products;
}
