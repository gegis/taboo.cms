import { animateScroll, scroller } from 'react-scroll';

class UiHelper {
  /**
   * @param y - px from top
   * @param options - { duration: 800, delay: 0, smooth: 'easeInOutQuart' }
   */
  scrollToTop(options) {
    animateScroll.scrollToTop(options);
  }

  /**
   * @param y - px from top
   * @param options - { duration: 800, delay: 0, smooth: 'easeInOutQuart' }
   */
  scrollTo(y = 0, options) {
    animateScroll.scrollTo(y, options);
  }

  /**
   * @param id - element id
   * @param options - { duration: 800, delay: 0, smooth: 'easeInOutQuart', offset: 100, isDynamic: false }
   */
  scrollToElementTop(id = 'main-container', options) {
    scroller.scrollTo(id, options);
  }

  // scrollToElementTop(id = 'main-container', top = 0) {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     setTimeout(() => {
  //       element.scrollTop = top;
  //     }, 0);
  //   }
  // }

  getDocumentBody() {
    return document.body;
  }

  getMainContainer() {
    return document.getElementById('main-container');
  }

  getMainContent() {
    const mainContent = document.getElementsByClassName('main-content');
    if (mainContent && mainContent[0]) {
      return mainContent[0];
    }
    return null;
  }
}

export default new UiHelper();
