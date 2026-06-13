import { useCallback, useEffect, useState} from "react";
import api from "../api/axios";
import { GameContext } from "./GameContext";

export const GameProvider = ({ children }) => {

    const [foundGames, setFoundGames] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: ''
    });

    const [category, setCategory] = useState('');

    const handleChangeName = (e) => {
        setFormData((prev) => ({
            ...prev,
            name: e.target.value
        }));
        console.log("formData:", formData);
    }

    const handleChangeCategory = (value) => {
        setFormData((prev) => ({
            ...prev,
            category: value
        }));
        console.log("formData:", formData);
    }

    const handleSearch = useCallback( async () => {
        try {
            const { data } = await api.get("/games", {
                params: {
                    name: formData.name ? formData.name : undefined,
                    category: formData.category ? formData.category : undefined
                }
            });
            setFoundGames(data.data);
            console.log('formData:', formData);
            console.log('foundGames:', foundGames);
            } catch (error) {
                console.log(error);
            }
    }, [formData, foundGames]);

    useEffect(() => {
        const search = () => {
            handleSearch();
        }

        search();
    }, [category]);

    return (<GameContext.Provider value={{handleSearch, foundGames, formData, handleChangeName, handleChangeCategory, category, setCategory}}>{children}</GameContext.Provider>);
};
