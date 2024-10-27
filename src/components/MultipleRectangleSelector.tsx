import React from 'react';

type MultipleRectangleSelectorProps = {
    labels: string[];
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
};

const MultipleRectangleSelector: React.FC<MultipleRectangleSelectorProps> = ({ labels, selected, setSelected }) => {
    const handleClick = (label: string) => {
        setSelected((prevSelected) => {
            let newSelected;
            if (prevSelected.includes(label)) {
                newSelected = prevSelected.filter((item) => item !== label);
            } else {
                newSelected = [...prevSelected, label];
            }
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