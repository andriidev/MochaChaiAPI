How to install:
- install node
- install nodemon: npm install -g nodemon
- install nyc: npm install nyc
- install dependences: $ npm install


Following plugins are very helpful in VS Code:
- intall plugin for Mocha code snippets (spoonscen.es6-mocha-snippets)
- install plugin for Mocha side pannel and setu it up (maty.vscode-mocha-sidebar)
    - add following to your settings.json
                //
                    "mochaExplorer.timeout": 10000,
                    "mochaExplorer.files": "test/**/*.ts",
                    "mochaExplorer.require": "ts-node/register",
                //


How to exectute tests:
- In terminal:
    - execute tests : $ npm run test
    - execute tests with listener: $ npm run test-dev
    - execute tests with junit report: $ npm run test-rep
        Test results are in './test-results.xml'
- In VS Code with side pannel

