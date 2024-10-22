import React, { useState } from 'react';

type RectangleSelectorProps = {
    labels: string[];
    onSelect: (selected: string) => void;
};

const RectangleSelector: React.FC<RectangleSelectorProps> = ({ labels, onSelect }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleClick = (label: string) => {
        setSelected(label);
        onSelect(label);
    };

    return (
        <div style={{ display: 'flex' }}>
            {labels.map((label) => (
                <div
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