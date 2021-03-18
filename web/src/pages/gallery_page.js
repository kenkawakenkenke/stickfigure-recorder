import {
    Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useCollectionDataOnce, useDocumentData } from "react-firebase-hooks/firestore";
import { useTranslation } from "react-i18next";
import firebase from "../framework/setup_firebase.js";

import PageTemplate from "./page_template.js";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "18px",
    },
    gifContainer: {
        display: "flex",
        flexFlow: "row wrap",
    },
    gif: {
        maxWidth: "120px",
        maxHeight: "120px",
    }
}));

function GalleryPage({ gifID }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [gifs, loading, error] = useCollectionDataOnce(
        firebase.firestore().collection("gallery")
            .orderBy("tCreated", "desc")
            .limit(30),
        { idField: "docKey" }
    );
    if (error) {
        return <div>{JSON.stringify(error)}</div>;
    }
    if (loading) {
        return <div>Loading...</div>
    }
    return <PageTemplate>
        <div className={classes.root}>
            {t("Gallery description")}
            <div className={classes.gifContainer}>
                {gifs.map(gif => {
                    return <div key={`gif_${gif.docKey}`}>
                        <a href={gif.publicURL}
                            target="_blank" >
                            <img
                                className={classes.gif}
                                src={gif.publicURL}
                            />
                        </a>
                    </div>;
                })}
            </div>
        </div >
    </PageTemplate >;
}
export default GalleryPage;
