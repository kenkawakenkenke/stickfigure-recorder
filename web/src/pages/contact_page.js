import {
    Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import PageTemplate from "./page_template.js";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "18px",
    },
}));

function TermsPage() {
    const classes = useStyles();

    return <PageTemplate>
        <div className={classes.root}>
            <p>This website was created by Ken Kawamoto. You can find him via his:</p>
            <p><a href="https://twitter.com/kenkawakenkenke">Twitter: @kenkawakenkenke</a></p>
            <p><a href="https://www.facebook.com/ken.kawamoto.167">Facebook</a></p>
            <p><a href="mailto:ken@kawamoto.co.uk">Email</a></p>
            <p><a href="https://kawamoto.co.uk">portfolio page</a></p>
        </div>
    </PageTemplate >;
}
export default TermsPage;
