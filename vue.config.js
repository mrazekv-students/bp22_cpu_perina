// Source: https://medium.com/@taverasady/how-to-use-ci-cd-for-vue-js-github-pages-605bbcf1dfdd
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/bp22_cpu_perina/'
    : '/'
}