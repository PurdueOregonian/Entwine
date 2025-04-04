import { Path, UseFormRegister } from "react-hook-form";
import InputWithValidation from "./InputWithValidation";
import { z, ZodObject } from "zod";

export const dateSchema = {
    month: z
        .string()
        .regex(/^(0?[1-9]|1[0-2])$/, "Month must be between 01 and 12"),
    day: z
        .string()
        .regex(/^(0?[1-9]|[12][0-9]|3[01])$/, "Day must be between 01 and 31"),
    year: z
        .string()
        .regex(/^\d{4}$/, "Year must be a valid 4-digit number")
        .refine((year) => {
            const yearNumber = Number(year);
            const currentYear = new Date().getUTCFullYear();
            return yearNumber >= 1000 && yearNumber <= currentYear;
        }, "Year must be between 1000 and the current year"),
};

type Date = {
    month: string;
    day: string;
    year: string;
}

type DatePickerProps<T extends Date> = {
    register: UseFormRegister<T>;
    schema: ZodObject<{
        month: z.ZodString;
        day: z.ZodString;
        year: z.ZodEffects<z.ZodString, string, string>;
    }>;
}

const DatePicker = <T extends Date>({
    register, schema
}: DatePickerProps<T>) => {
    const processValue = (value: string) => {
        if (value.length === 1 && value >= "1" && value <= "9") {
            return '0' + value;
        }
        return value;
    }

    return (
        <div className="flex gap-2.5 justify-center items-center mb-2.5">
            <div>
                <InputWithValidation
                    register={register}
                    fieldValue={"month" as Path<T>} // https://github.com/react-hook-form/react-hook-form/issues/6726
                    label="Month"
                    testId="month"
                    placeholder="MM"
                    validateInput={(value) => schema.shape.month.safeParse(value).success}
                    processValue={processValue}
                />
            </div>
            <div>
                <InputWithValidation
                    register={register}
                    fieldValue={"day" as Path<T>}
                    label="Day"
                    testId="day"
                    placeholder="DD"
                    validateInput={(value) => schema.shape.day.safeParse(value).success}
                    processValue={processValue}
                />
            </div>
            <div>
                <InputWithValidation
                    register={register}
                    fieldValue={"year" as Path<T>}
                    label="Year"
                    testId="year"
                    placeholder="YYYY"
                    validateInput={(value) => schema.shape.year.safeParse(value).success}
                />
            </div>
        </div>
    );
}

export default DatePicker;