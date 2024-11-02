import NavHeader from "../components/NavHeader";
import { Typography } from "@mui/material";

function NotFoundPage() {
    return (
        <>
            <NavHeader />
            <div className="alignVertical center">
                <Typography variant="h2">404</Typography>
                <Typography variant="h3">Page Not Found</Typography>
            </div>
        </>
    );
}

export default NotFoundPage;