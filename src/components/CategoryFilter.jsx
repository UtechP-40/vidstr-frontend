import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations, setSelectedCategory } from '../redux/features/recommendation.slice';
import { axiosInstance } from "../lib/axios";

const CategoryFilter = () => {
    const dispatch = useDispatch();
    const [activeCategory, setActiveCategory] = React.useState({ _id: "all", name: "All" });
    const [allCategories, setAllCategories] = React.useState([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/category');
                setAllCategories([{ _id: "all", name: "All" }, ...response.data.data]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    React.useEffect(() => {
        dispatch(setSelectedCategory(activeCategory));
    }, [activeCategory, dispatch]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {allCategories.map((category) => (
                <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
                        ${activeCategory._id === category._id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;