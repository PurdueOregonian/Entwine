import React, { useState } from 'react';

type MultipleRectangleSelectorProps = {
    labels: string[];
    onSelect: (selected: string[]) => void;
};

const MultipleRectangleSelector: React.FC<MultipleRectangleSelectorProps> = ({ labels, onSelect }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const handleClick = (label: string) => {
        setSelected((prevSelected) => {
            let newSelected;
            if (prevSelected.includes(label)) {
                newSelected = prevSelected.filter((item) => item !== label);
            } else {
                newSelected = [...prevSelected, label];
            }
            onSelect(newSelected);
            return newSelected;
        });
    };

    return (
        <div style={{ display: 'flex' }}>
            {labels.map((label) => (
                <div
                    data-testid={`multipleRectangleSelector-${label}`}
                    className={
                        "rectangleSelectorOption " + 
                        (selected.includes(label) ? "rectangleSelectorSelected" : "rectangleSelectorUnselected")
                    }
                    key={label}
                    onClick={() => handleClick(label)}
                >
                    {label}
                </div>
            ))}
        </div>
    );
};

export default MultipleRectangleSelector;