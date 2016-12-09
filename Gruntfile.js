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
                src: 'repo-test/repos1', // NOTE: avoid ** ; **/* because recursive cloning repo into repo
                repos: [
                    {
                        name: 'measurement', // needed
                        url: 'git@gitlab.greenpocket.intern:product/measurement-view.git', // needed
                        branch: 'develop', // optional
                    },
                    {
                        name: 'measurement2', // needed
                        url: 'git@gitlab.greenpocket.intern:product/measurement-view.git', // needed
                        branch: '2.8.0', // optional
                    },
                    {
                        name: 'measurement3', // needed
                        url: 'git@gitlab.greenpocket.intern:product/measurement-view.git', // needed
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
