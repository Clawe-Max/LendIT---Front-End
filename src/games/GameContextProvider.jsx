import { useCallback, useState} from "react";
import api from "../api/axios";
import { GameContext } from "./GameContext";

export const GameProvider = ({ children }) => {

    const [foundGames, setFoundGames] = useState(null);
    const [formData, setFormData] = useState({
        name: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSearch = useCallback( async () => {
        try {
            const response = await api.get("/games", {
                params: {
                    name: formData.name ? formData.name : undefined
                }
            });
            setFoundGames(response?.data);
            console.log("name:", formData)
            console.log("found games:", foundGames);
            } catch (error) {
            console.log(error);
            }
    }, [formData, foundGames])

    return (<GameContext.Provider value={{handleSearch, foundGames, formData, handleChange}}>{children}</GameContext.Provider>);
};
