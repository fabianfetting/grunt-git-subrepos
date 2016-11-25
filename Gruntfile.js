/*
 * grunt-git-subrepos
 * https://github.com/fabian/grunt-git-subrepos
 *
 * Copyright (c) 2016 Fabian Fetting
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Configuration to be run (and then tested).
        subrepos: {
            options: { // global
                force: false,
            },
            example1: {
                options: { // local
                    force: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: 'testing2',
                        src: 'inner',
                        repoName: 'test',
                        repo: 'url://test',
                    },
                    {
                        expand: true,
                        cwd: 'testing',
                        src: '/',
                        repo: 'url://test',
                        branch: 'develop'
                    },
                    {
                        src: 'testing2/inner',
                        repoName: 'test',
                        repo: 'url://test',
                    },
                ],
                // files: [
                //     {
                //         cwd: 'test/',
                //         ex: {
                //             repository: 'git@github.com:fur6y/example1.git',
                //             branch: 'feature/example1',
                //             directory: 'example1',
                //             remote: 'origin',
                //         },
                //     },
                //     {
                //         cwd: 'test/',
                //         repository: 'git@github.com:fur6y/example1.git',
                //         branch: 'feature/example1',
                //         directory: 'example1',
                //         remote: 'origin',
                //     },
                // ]
            },
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['subrepos']);

};
