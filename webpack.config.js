const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 


const isDevelopment = process.env.NODE_ENV === 'development'; 


module.exports = {
  mode: 'development',
  entry: './src/renderer/index.tsx', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), 
    publicPath: './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html', 
    }),
    new CopyWebpackPlugin({
        patterns: [
          { from: 'src/services', to: 'services' }, 
          { from: 'public/assets', to: 'assets' },


        ],
      }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], 
    alias: {
    components: path.resolve(__dirname, 'src/renderer/components/'),
    renderer: path.resolve(__dirname, 'src/renderer/'),
    services: path.resolve(__dirname, 'src/services/'), 
    },
    fallback: { 
      "os": require.resolve("os-browserify/browser") 
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,        
        use: {
            loader: 'ts-loader',
            options: { transpileOnly: true }, 
          },      
        exclude: /node_modules/, 
      },
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },

      {
        test: /\.(png|jpe?g|gif|svg|webp)$/, 
        type: 'asset/resource',              
        generator: {
          filename: 'assets/images/[name][ext]',    
        },
      }
    ],
  },
};



if (isDevelopment) {
  config.devServer = {
    static: {
      directory: path.resolve(__dirname, 'dist'), 
    },
    compress: true, 
    port: 3000, 
    hot: true, 
    proxy: {
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, 
      },
    },
  };
}       