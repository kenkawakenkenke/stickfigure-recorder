import {
    Slider
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const RangeSlider = withStyles({
    root: {
        color: '#220000',
        height: 3,
        padding: '13px 0',
    },
    thumb: {
        height: 27,
        width: 27,
        backgroundColor: '#fdfdfd',
        marginTop: -12,
        marginLeft: -13,
        boxShadow: '#ccc 0 2px 3px 1px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#999 0 2px 3px 1px',
        },
        '& .arrowRight': {
            width: "0",
            height: "0",
            marginLeft: "2px",
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: "10px solid #4350AF",
        },
        '& .arrowLeft': {
            width: "0",
            height: "0",
            marginRight: "2px",
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "10px solid #4350AF",
        }
    },
})(Slider);
function RangeSliderThumbComponent(props) {
    const isOpeningRange = props["data-index"] === 0;
    if (isOpeningRange) {
        return (
            <span {...props}>
                <span className="arrowRight" />
            </span>
        );
    }
    return (
        <span {...props}>
            <span className="arrowLeft" />
        </span>
    );
}

function StartEndSlider({ range, setRange, maxIndex, beginFocusCallback, stopFocusCallback }) {
    return <RangeSlider
        value={range}
        onChange={(e, newRange) => {
            setRange(newRange);
            if (e.target.dataset["index"]) {
                const isStart = e.target.dataset["index"] === "0";
                beginFocusCallback(isStart ? newRange[0] : newRange[1]);
            }
        }}
        onChangeCommitted={(e, newRange) => {
            stopFocusCallback();
        }}
        valueLabelDisplay="auto"
        min={0}
        max={maxIndex}
        ThumbComponent={RangeSliderThumbComponent}
    />;
}
export default StartEndSlider;
