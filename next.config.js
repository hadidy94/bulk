/** @type {import('next').NextConfig} */
const StylelintPlugin = require("stylelint-webpack-plugin");
const { i18n } = require("./next-i18next.config");



const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  webpack: (config, options) => {
    config.plugins.push(new StylelintPlugin());
    return config;
  },
  env:{
    API_URL: process.env.API_URL
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
