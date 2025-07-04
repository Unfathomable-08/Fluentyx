export const GA_TRACKING_ID = 'G-QZDD1NNBWS';

// Log page views
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
