import React from 'react';
import { FieldValues, Path, UseFormWatch } from 'react-hook-form';

type RectangleSelectorProps<TForm extends FieldValues, T extends string> = {
    fieldValue: Path<TForm>
    setValue: (field: Path<TForm>, value: T) => void
    watch: UseFormWatch<TForm>;
    labels: T[]
};

const RectangleSelector = <TForm extends FieldValues, T extends string>(props: RectangleSelectorProps<TForm, T>): React.ReactElement => {
    const {fieldValue, setValue, watch, labels} = props;
    const selected = watch(fieldValue) as T;
    const handleClick = (label: T) => {
        setValue(fieldValue, label);
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