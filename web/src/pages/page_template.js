import {
  useEffect,
} from "react";
import {
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

import { TwitterFollowButton } from 'react-twitter-embed';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "24px",
    marginRight: "24px",
  },
  unstyledLink: {
    color: "black",
    textDecoration: "none",
  },
  smallGif: {
    width: "80px",
  },

  bottomBar: {
    display: "flex",
  },
  linkBlock: {
    display: "inline-block",
    marginRight: "4px",
  }
}));

// From: https://qiita.com/qrusadorz/items/14972b6e069feaf777a9
function AdsCard(props) {
  useEffect(() => {
    if (window.adsbygoogle/* && process.env.NODE_ENV !== "development"*/) {
      window.adsbygoogle.push({});
    }
  }, [])

  return (
    <ins className="adsbygoogle"
      style={{ "display": "block" }}
      data-ad-client={process.env.REACT_APP_GOOGLE_AD_CLIENT}
      data-ad-slot={process.env.REACT_APP_GOOGLE_AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
}

function BottomBar() {
  const classes = useStyles();
  return <div className={classes.bottomBar}>
    <div className={classes.linkBlock}>
      <Link to="/">Top</Link>
    </div>
    <div className={classes.linkBlock}>
      <Link to="/terms">Terms</Link>
    </div>
    <div className={classes.linkBlock}>
      <Link to="/privacy">Privacy</Link>
    </div>
    <div className={classes.linkBlock}>
      <Link to="/contact">Contact</Link>
    </div>
    <div className={classes.linkBlock}>
      <TwitterFollowButton screenName={'kenkawakenkenke'} />
    </div>
  </div>
}

function PageTemplate({ children, className }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const rootClass = [classes.root];
  if (className) {
    rootClass.push(className);
  }
  return <div className={rootClass.join(" ")}>
    <Typography variant="h3">
      <Link to="/" className={classes.unstyledLink}>
        <Trans>Stickfigure Recorder</Trans>
      </Link>
    </Typography>
    <div>
      <img src="/imgs/small_dance.gif" alt="dancing gif" className={classes.smallGif} />
      <img src="/imgs/small_exercise.gif" alt="working out gif" className={classes.smallGif} />
      <img src="/imgs/small_fighting.gif" alt="fighting gif" className={classes.smallGif} />
      <img src="/imgs/small_running.gif" alt="running gif" className={classes.smallGif} />
    </div>

    {/* Main contents */}
    <div>
      {children}
    </div>

    <AdsCard />
    <div>
      <FacebookShareButton url={["http://stickfigure-recorder.web.app/"]} quote={[t("SNS Share text")]}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={["http://stickfigure-recorder.web.app/"]}
        title={[t("Twitter Share text")]}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
    <BottomBar />
  </div>
}
export default PageTemplate;
