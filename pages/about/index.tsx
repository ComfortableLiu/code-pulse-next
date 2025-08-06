import { Fragment, memo } from "react";
import FirstVisitWelcome from "@pages/_components/FirstVisitWelcome";
import ContactMe from "@pages/_components/ContactMe";
import styles from "./styles.module.scss"

const AboutUs = () => {
  return (
    <Fragment>
      <FirstVisitWelcome />
      <hr className={styles.hr} />
      <ContactMe />
    </Fragment>
  )
}

export default memo(AboutUs)

