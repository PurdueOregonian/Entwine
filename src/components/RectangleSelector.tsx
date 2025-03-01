import React from 'react';

type RectangleSelectorProps<T extends string> = {
    labels: T[];
    selected: T | null;
    setSelected: React.Dispatch<React.SetStateAction<T | null>>;
};

const RectangleSelector = <T extends string>(props: RectangleSelectorProps<T>): React.ReactElement => {
    const {labels, selected, setSelected} = props;
    const handleClick = (label: T) => {
        setSelected(label);
    };

    return (
        <div className='flex'>
            {labels.map((label) => (
                <div
                    data-testid={`rectangleSelector-${label}`}
                    className={"rectangleSelectorOption " + (selected === label ? "rectangleSelectorSelected" : "rectangleSelectorUnselected")}
                    key={label}
                    onClick={() => handleClick(label)}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};

export default RectangleSelector;