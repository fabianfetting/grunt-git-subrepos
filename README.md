# grunt-git-subrepos

> Clone and update a list of git repositories.

## Getting Started
This plugin requires Grunt `>=0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-git-subrepos --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-git-subrepos');
```

## The "subrepos" task

### Overview
In your project's Gruntfile, add a section named `subrepos` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  subrepos: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.force
Type: `Boolean`
Default value: `false`

Set this option to force the task not to exit on changes at a repository. It only prints an error message.


### Src
Type: `String`

The directories to put the repositories in.


### Repo

#### name
Type: `String`

The directory name of the repository.

#### url
Type: `String`

The repository url.

#### branch
Type: `String`
Default value: remote repository’s HEAD (e.g. master)

The repository branch.


### Usage Examples

```js
subrepos: {
    options: {
        force: true,
    },
    example: {
        src: 'components',
        repos: [
            {
                name: 'spoon',
                url: 'git@github.com:octocat/Spoon-Knife.git',
                branch: 'test-branch', // optional
            },
            {
                name: 'Hello-World',
                url: 'git@github.com:octocat/Hello-World.git',
            }
        ],
    },
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
[Github releases](https://github.com/fur6y/grunt-git-subrepos/releases)
