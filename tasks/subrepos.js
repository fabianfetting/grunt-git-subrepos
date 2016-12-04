/*
 * grunt-git-subrepos
 * https://github.com/fur6y/grunt-git-subrepos
 *
 * Copyright (c) 2016 Fabian Fetting
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var git = {
        isRepo: function(path, doneCallback) {
            grunt.log.debug('Cwd:', process.cwd() + '/' + path);
            grunt.log.debug('Spawn cmd:', 'git rev-parse --is-inside-work-tree --quiet');

            grunt.util.spawn({
                cmd: 'git',
                args: ['rev-parse', '--quiet', '--is-inside-work-tree'],
                opts: { cwd: process.cwd() + '/' + path },
            }, function (error, result, code) {
                doneCallback(code === 0 && result === 'true');
            });
        },
        branchName: function (path, doneCallback) {
            grunt.util.spawn(
                {
                    cmd: 'git',
                    grunt: false,
                    args: ['rev-parse', '--abbrev-ref', 'HEAD'],
                    opts: {
                        cwd: path,
                    },
                },
                function doneFunction(error, result, code) {
                    doneCallback(String(result));
                }
            );
        },
        isUntouched: function (path, doneCallback) {
            this.branchName(path, function (currentBranch) {
                grunt.util.spawn(
                    {
                        cmd: 'git',
                        grunt: false,
                        args: ['diff', '--quiet', 'origin/' + currentBranch],
                        opts: {
                            cwd: path,
                        },
                    },
                    function doneFunction(error, result, code) {
                        var isUnchanged = code === 0;
                        doneCallback(isUnchanged);
                    }
                );
            });
        },
        clone: function (path, repo, branch, doneCallback) {
            var args = [];
            args.push('clone', '--quiet');
            if (branch) { args.push('--branch', branch); }
            args.push(repo, path);

            grunt.log.debug('Spawn cmd:', 'git', args);

            if (grunt.option('no-write')) { return doneCallback(); }

            grunt.util.spawn({
                cmd: 'git',
                args: args,
            }, doneCallback);
        },
        checkout: function(path, branch, doneCallback) {
            grunt.log.debug('Spawn cmd:', 'git checkout --quiet ' + branch);
            doneCallback();
        },
        pull: function(path, doneCallback) {
            grunt.log.debug('Spawn cmd:', 'git pull --quiet');
            doneCallback();
        },
    };

    grunt.registerMultiTask('subrepos', 'Description.', function () {
        var done = this.async();

        var options = this.options({
            force: false,
        });

        this.files.forEach(function (file) {
            var repo = file.repo;
            var repoName = file.repoName || '';
            var branch = file.branch || '';

            grunt.verbose.writeln('');
            grunt.verbose.write('Repo:', '\'' + repo.cyan + '\'');
            grunt.verbose.write(', ');
            grunt.verbose.write('RepoName:', '\'' + repoName.cyan + '\'');
            grunt.verbose.write(', ');
            grunt.verbose.writeln('Branch:', '\'' + branch.cyan + '\'');

            file.src.forEach(function (filePath, i) {
                filePath += repoName || '';
                grunt.verbose.writeln('Path: ' + filePath.cyan);

                if (!grunt.file.isDir(filePath)) {
                    grunt.log.debug('Path ' + filePath + ' NOT exists.');
                    grunt.file.mkdir(filePath);
                    git.clone(filePath, repo, branch, function () {
                        grunt.verbose.ok();
                    });

                } else {
                    grunt.log.debug('Path ' + filePath + ' exists.');

                    git.isRepo(filePath, function (isRepo) {
                        if (isRepo) {
                            git.isUntouched(filePath, function (isUntouched) {
                                if (isUntouched) {
                                    grunt.log.debug('Git repo exists.');

                                    git.checkout(filePath, branch, function () {
                                        git.pull(filePath, function () {
                                            grunt.verbose.ok();
                                        });
                                    });

                                } else {
                                    grunt.log.errorlns('Could\'t update repo because of local changes.');
                                }
                            });

                        } else {
                            grunt.fail.warn('Path ' + filePath + ' exists but is not a git repository.');
                            grunt.verbose.ok();
                        }
                    });

                }
            });
        });

        done();
    });

};
