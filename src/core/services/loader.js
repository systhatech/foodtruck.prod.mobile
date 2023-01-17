export const pageLoaderShow = () => {
    this.$bus.$emit('SHOW_PAGE_LOADER');
};
export const pageLoaderHide = () => {
    this.$bus.$emit('HIDE_PAGE_LOADER');
};
export default { pageLoaderShow, pageLoaderHide };
  