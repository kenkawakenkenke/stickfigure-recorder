import { Button, makeStyles, Typography } from "@material-ui/core";
import common from "stickfigurecommon";
import ToggleButton from '@material-ui/lab/ToggleButton';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {

    },
    selectionItemRow: {
        display: "flex",
        alignItems: "center",
    },
    smallIcon: {
        width: "24px",
        height: "24px",
        marginRight: "4px",
    },
}));

function ItemSelectorPanel({ selectedItems, selectedItemsCallback }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const stopSignSelected = selectedItems.some(item => item.type === "stopsign");

    function createNewItem(type) {
        selectedItemsCallback(
            [...selectedItems,
            { type }]
        );
    }
    function removeItem(type) {
        selectedItemsCallback(
            selectedItems.filter(item => item.type !== type)
        );
    }

    // TODO(ken): add other items, generalize.
    return <div className={classes.root}>
        <div>
            <Typography variant="subtitle1">
                {t("Select items")}
            </Typography>
        </div>
        <div className={classes.selectionItemRow}>
            <ToggleButton
                selected={stopSignSelected}
                onChange={() => {
                    if (stopSignSelected) {
                        removeItem("stopsign");
                    } else {
                        createNewItem("stopsign");
                    }
                }}
            >
                <img src={common.Painter.Items.StopSignIcon} className={classes.smallIcon} />
                {t("Stop sign")}
            </ToggleButton>
        </div>

    </div>;
}
export default ItemSelectorPanel;
