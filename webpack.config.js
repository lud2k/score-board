
module.exports = {
  entry: './src/index.tsx',
  target: 'web',
  output: {
    path: __dirname + '/public',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            camelCase: true
          }
        }]
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.json'
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.json$/,
        loader: 'raw-loader',
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  }
}
