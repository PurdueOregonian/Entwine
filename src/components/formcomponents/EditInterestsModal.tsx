import { Box, Modal, Tooltip, Typography } from "@mui/material";
import InterestChip from "../InterestChip";
import CloseIcon from '@mui/icons-material/Close';
import { FieldValues, Path, UseFormWatch } from "react-hook-form";

type EditInterestsProps<TForm extends FieldValues> = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    interestMap: Map<number, Interest>;
    interestCategoryMap: Map<number, InterestCategory>;
    fieldValue: Path<TForm>;
    setValue: (field: Path<TForm>, value: number[]) => void;
    watch: UseFormWatch<TForm>;
}

const EditInterestsModal = <TForm extends FieldValues>(
    { open, setOpen, interestMap, interestCategoryMap, fieldValue, setValue, watch }: EditInterestsProps<TForm>) => {
    const interests = watch(fieldValue) as number[] || [];
    const handleClick = (interest: Interest) => {
        if (interests.includes(interest.id)) {
            setValue(fieldValue, interests.filter(id => id !== interest.id));
        } else {
            setValue(fieldValue, [...interests, interest.id]);
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="edit-interests-modal"
            aria-describedby="edit-interests-modal-description"
        >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-black shadow-md p-4">
                <Typography variant="h6" component="h2">
                    Edit Interests
                </Typography>
                <Tooltip title="Close">
                    <CloseIcon
                        data-testid="closeEditInterests"
                        className="topRightButton muiClickableButton"
                        onClick={() => setOpen(false)}
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
            </Box>
        </Modal>
    );
};

export default EditInterestsModal;