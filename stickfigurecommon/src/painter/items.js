import StopSignIcon from "../../imgs/stopsign.svg";
import AllowSignIcon from "../../imgs/allowsign.svg";

let initialized = false;
export async function init(imageLoader) {
    if (initialized) {
        return;
    }
    initialized = true;

    const iconSpecs = [{
        type: "stopsign",
        icon: StopSignIcon,
    }, {
        type: "allowsign",
        icon: AllowSignIcon,
    }];

    for (const iconSpec of iconSpecs) {
        await new Promise(resolve => {
            imageLoader(iconSpec.icon, image => {
                iconForType[iconSpec.type] = image;
                resolve(image);
            });
        });
    }
}

let iconForType = {};
export function getImage(iconType) {
    return iconForType[iconType];
}

// let stopSignImage;
// export function getStopSignImage() {
//     return stopSignImage;
// }
export {
    StopSignIcon,
    AllowSignIcon,
}