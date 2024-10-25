import { Typography } from "@mui/material";
import IntegerSliderRangeSelect from "./IntegerSliderRangeSelect";
import NavHeader from "./NavHeader";
import { useState } from "react";
import MultipleRectangleSelector from "./MultipleRectangleSelector";

function Search() {
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(100);
    const [genders, setGenders] = useState<string[]>([]);

    return (
        <>
            <NavHeader />
            <div className="alignVertical center gap10">
                <div className="alignHorizontal center gap10">
                    <Typography>Age</Typography>
                    <IntegerSliderRangeSelect
                        minValue={minAge}
                        setMinValue={setMinAge}
                        maxValue={maxAge}
                        setMaxValue={setMaxAge}
                        min={18}
                        max={100}
                    />
                </div>
                <div className="alignHorizontal center gap10">
                    <Typography>Gender</Typography>
                    <MultipleRectangleSelector
                        labels={["Male", "Female", "Other"]}
                        onSelect={(genders: string[]) => { setGenders(genders) }}
                    />
                </div>
            </div>
        </>
    );
}

export default Search;