/*
 * grunt-git-subrepos
 * https://github.com/fur6y/grunt-git-subrepos
 *
 * Copyright (c) 2016 Fabian Fetting
 * Licensed under the MIT license.
 */

module.exports = (grunt) => {
    // Project configuration.
    grunt.initConfig({
        subrepos: {
            options: {
                force: false,
            },
            example1: {
                options: {
                    force: true,
                },
                src: 'components', // NOTE: avoid "**", "**/*" b/c it causes recursive cloning of repos into repos
                repos: [
                    {
                        name: 'spoon',
                        url: 'git@github.com:octocat/Spoon-Knife.git',
                        branch: 'master',
                    },
                    {
                        name: 'hello_world',
                        url: 'git@github.com:octocat/Hello-World.git',
                        branch: 'test',
                    },
                    {
                        name: 'Hello-World',
                        url: 'git@github.com:octocat/Hello-World.git',
                    },
                ],
            },
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['subrepos']);
};
