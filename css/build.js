const fs = require('fs')
const Sass = require('sass')
const { SourceFile, DependencyTree } = require('./builder.js')

// Generates css files from scss files
function buildCSS (generatedFilePath, primarySource, secondarySources) {
  fs.promises.writeFile(generatedFilePath, Sass.renderSync({
    data: primarySource.getContents(),
    importer: [
      function (url) {
        return {
          contents: secondarySources[url].getContents()
        }
      }
    ],
    sourceComments: true
  }).css
  ).then(() => {
    console.log(`generated ${generatedFilePath}`)
  }).catch((err) => {
    console.log(`ERROR: Failed to generate ${generatedFilePath}`)
    console.error(err)
  })
}

const sources = {
  'abbreviation-autocomplete.scss':    new SourceFile('./scss/_abbreviation-autocomplete.scss'),
  'calculator.scss':                   new SourceFile('./scss/_calculator.scss'),
  'home.scss':                         new SourceFile('./scss/home.scss'),
  'isaac-pills.scss':                  new SourceFile('./scss/_isaac-pills.scss'),
  'noscript.scss':                     new SourceFile('./scss/noscript.scss'),
  'sudoku-solver.scss':                new SourceFile('./scss/_sudoku-solver.scss'),
  'weather-bot.scss':                  new SourceFile('./scss/_weather-bot.scss')
}

const buildTrees = [
  new DependencyTree(
    './home.css',
    sources['home.scss'],
    [
      sources['abbreviation-autocomplete.scss'],
      sources['calculator.scss'],
      sources['isaac-pills.scss'],
      sources['sudoku-solver.scss'],
      sources['weather-bot.scss']
    ],
    buildCSS
  ),
  new DependencyTree(
    './noscript.css',
    sources['noscript.scss'],
    [
    ],
    buildCSS
  )
]

// Lazily builds generated files from dependencies
//  @param  {DependencyTree[]}  buildTrees A list of the files to be generated and their dependencies represented as trees
//  @throws {TypeError}         when an argument is of the wrong type
function build (buildTrees) {
  if (!(buildTrees instanceof Array)) {
    throw new TypeError('Param buildTrees must be an array')
  }

  buildTrees.forEach((buildTree, index) => {
    if (!(buildTree instanceof DependencyTree)) {
      throw new TypeError(`Param buildTrees must contain only DependencyTree objects. Encountered incompatible object at index: ${index}`)
    }
  })

  console.log('INFO: Generated files will only be updated if the source files were last modified later than the generated files.')

  buildTrees.forEach((buildTree) => {
    buildTree.statFiles()
      .then(() => {
        if (buildTree.isOutdated()) {
          buildTree.generateFile()
        }
      })
  })
}

build(buildTrees)
