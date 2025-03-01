import InputWithValidation from "./InputWithValidation";

type DatePickerProps = {
    month: string;
    day: string;
    year: string;
    setMonth: React.Dispatch<React.SetStateAction<string>>;
    setDay: React.Dispatch<React.SetStateAction<string>>;
    setYear: React.Dispatch<React.SetStateAction<string>>;
}

const DatePicker: React.FC<DatePickerProps> = ({
    month, day, year, setMonth, setDay, setYear
}) => {
    const validateMonth = (input: string) => {
        return /^(0?[1-9]|1[0-2])?$/.test(input);
    }

    const validateDay = (input: string) => {
        return /^(0?[1-9]|[12][0-9]|3[01])?$/.test(input);
    }

    const validateYear = (input: string) => {
        return /^([12]\d{3})?$/.test(input);
    }

    const handleBlur = (setInput: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (value.length === 1 && /^[1-9]$/.test(value)) {
            setInput('0' + value);
        }
    }

    return (
        <div className="alignHorizontal gap-2.5 center mb-2.5">
            <div className="alignVertical">
                <InputWithValidation
                    label="Month"
                    testId="month"
                    placeholder="MM"
                    input={month}
                    setInput={setMonth}
                    validateInput={validateMonth}
                    onBlur={() => handleBlur(setMonth, month)}
                />
            </div>
            <div className="alignVertical">
                <InputWithValidation
                    label="Day"
                    testId="day"
                    placeholder="DD"
                    input={day}
                    setInput={setDay}
                    validateInput={validateDay}
                    onBlur={() => handleBlur(setDay, day)}
                />
            </div>
            <div className="alignVertical">
                <InputWithValidation
                    label="Year"
                    testId="year"
                    placeholder="YYYY"
                    input={year}
                    setInput={setYear}
                    validateInput={validateYear}
                />
            </div>
        </div>
    );
}

export default DatePicker;