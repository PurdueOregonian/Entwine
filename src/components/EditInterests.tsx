import { Box, Tooltip, Typography } from "@mui/material";
import InterestChip from "./InterestChip";
import CloseIcon from '@mui/icons-material/Close';

type EditInterestsProps = {
    onClose: () => void;
    interests: number[];
    setInterests: (interests: number[]) => void;
    interestMap: Map<number, Interest>;
    interestCategoryMap: Map<number, InterestCategory>;
}

const EditInterests = ({ onClose, interests, setInterests, interestMap, interestCategoryMap }: EditInterestsProps) => {
    const handleClick = (interest: Interest) => {
        if (interests.includes(interest.id)) {
            setInterests(interests.filter(id => id !== interest.id));
        } else {
            setInterests([...interests, interest.id]);
        }
    }

    return (
        <>
            <Typography variant="h6" component="h2">
                Edit Interests
            </Typography>
            <Tooltip title="Close">
                <CloseIcon
                    data-testid="closeEditInterests"
                    className="topRightButton muiClickableButton"
                    onClick={onClose}
                >
                </CloseIcon>
            </Tooltip>
            {Array.from(interestCategoryMap.values()).map(category => (
                <Box key={category.id} mb={2}>
                    <Typography variant="h6">{category.name}</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {Array.from(interestMap.values())
                            .filter(interest => interest.categories.includes(category.id))
                            .map(interest => (
                                <InterestChip
                                    key={interest.id}
                                    interest={interest}
                                    isSelected={interests.includes(interest.id)}
                                    onClick={() => handleClick(interest)}
                                />
                            ))}
                    </Box>
                </Box>
            ))}
        </>
    );
};

export default EditInterests;