import React from 'react';

type RectangleSelectorProps = {
    labels: string[];
    selected: string | null;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const RectangleSelector: React.FC<RectangleSelectorProps> = ({ labels, selected, setSelected }) => {
    const handleClick = (label: string) => {
        setSelected(label);
    };

    return (
        <div style={{ display: 'flex' }}>
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