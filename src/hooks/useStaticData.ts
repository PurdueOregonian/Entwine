import { useContext } from "react"
import StaticDataContext from "../StaticDataContext";

const useStaticData = () => {
    return useContext(StaticDataContext);
}

export default useStaticData;