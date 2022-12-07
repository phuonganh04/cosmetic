import { useEffect, useState } from "react";
import axiosClient from "../../components/common-component/apis"

export const useFetchCategories = () => {
	const [categories, setCategories] = useState<any>([]);
    
	useEffect(() => {
		axiosClient.get("/categories").then(response => setCategories(response?.data || []));
	}, [])
    
	return categories;
}
