# Multi STL Viewer
The aim of this project is to show how to load multiple STL files using [Stl Viewer Javascript Plugin](https://www.viewstl.com/plugin/ "Stl Viewer Javascript Plugin") and display them as separate layers

## Instructions
* Add your STL files into `assets` folder
* In `index.html`, customize the list of STL files to load (`body.onload` event)
* Since [Stl Viewer Javascript Plugin](https://www.viewstl.com/plugin/ "Stl Viewer Javascript Plugin") requires [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers "Web Workers"), there are two ways to open the `index.html`:
    1. Using an HTTP server
    2. Launching Google Chrome with `--allow-file-access-from-files` and open the `index.html` file