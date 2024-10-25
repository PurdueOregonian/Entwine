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

    return (
        <div className="alignHorizontal gap10 center">
            <div className="alignVertical" style={{ marginBottom: '10px' }}>
                <label>Month</label>
                <InputWithValidation
                    testId="month"
                    placeholder="MM"
                    input={month}
                    setInput={setMonth}
                    validateInput={validateMonth}
                />
            </div>
            <div className="alignVertical" style={{ marginBottom: '10px' }}>
                <label htmlFor="day">Day</label>
                <InputWithValidation
                    testId="day"
                    placeholder="DD"
                    input={day}
                    setInput={setDay}
                    validateInput={validateDay}
                />
            </div>
            <div className="alignVertical" style={{ marginBottom: '10px' }}>
                <label htmlFor="year">Year</label>
                <InputWithValidation
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