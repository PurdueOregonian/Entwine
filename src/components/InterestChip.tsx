import { Chip } from "@mui/material";

type InterestChipProps = {
    interest: Interest;
    isSelected: boolean;
    onClick: (interest: Interest) => void;
}

const InterestChip = ({ interest, isSelected, onClick }: InterestChipProps) => {
    return (
        <>
            <Chip
                label={interest.name}
                onClick={() => onClick(interest)}
                color={isSelected ? 'primary' : 'default'}
            />
        </>
    );
};

export default InterestChip;