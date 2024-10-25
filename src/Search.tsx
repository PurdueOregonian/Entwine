import { Typography } from "@mui/material";
import IntegerSliderRangeSelect from "./IntegerSliderRangeSelect";
import NavHeader from "./NavHeader";
import { useState } from "react";

function Search() {
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(100);

    return (
        <>
            <NavHeader />
            <div className="alignHorizontal center gap10">
                <Typography gutterBottom>Age</Typography>
                <IntegerSliderRangeSelect
                    minValue={minAge}
                    setMinValue={setMinAge}
                    maxValue={maxAge}
                    setMaxValue={setMaxAge}
                    min={18}
                    max={100}
                />
            </div>
        </>
    );
}

export default Search;