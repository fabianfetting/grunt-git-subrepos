/*
 * grunt-git-subrepos
 * https://github.com/fur6y/grunt-git-subrepos
 *
 * Copyright (c) 2016 Fabian Fetting
 * Licensed under the MIT license.
 */

const gitHelper = require('./lib/git-helper');

module.exports = function subrepos(grunt) {
    const git = gitHelper(grunt);

    grunt.registerMultiTask('subrepos', 'Description.', function subreposTask() {
        this.requiresConfig([this.name, this.target, 'repos'].join('.'));

        const done = this.async();
        const options = this.options({
            force: false,
        });
        const promises = [];

        this.filesSrc.forEach((file) => {
            if (!grunt.file.isDir(file)) {
                grunt.log.error(`Skipped path "${file}" because it's not a directory.`.red);
                return;
            }

            grunt.log.debug('Dir:', file);

            this.data.repos.forEach((repo) => {
                const separator = file.endsWith('/') ? '' : '/';
                const path = file + separator + repo.name;
                const repoConfig = Object.assign({ path }, repo);

                let promise;
                if (!grunt.file.isDir(path)) {
                    grunt.log.writeln(`Cloning ${path.cyan}...`);
                    promise = git.clone(repoConfig);
                } else {
                    grunt.log.writeln(`Updating ${path.cyan}...`);
                    promise = git.update(repoConfig);
                }
                promises.push(promise);
            });
        });

        Promise.all(promises)
        .then((results = []) => {
            grunt.log.debug('Done results:', results);
            grunt.log.ok();
            done();
        })
        .catch(([status, repo = { name: '-' }]) => {
            grunt.log.debug('Error result:', status, repo);

            if (status !== git.status.CHANGED && status !== git.status.LOCAL_COMMITS) {
                grunt.fail.fatal(status);
            } else {
                let errorMessage = `Skipped update of repository "${repo.path}".`;
                if (status === git.status.CHANGED) { errorMessage += ' It has local changes.'; }
                if (status === git.status.LOCAL_COMMITS) { errorMessage += ' It has local commits.'; }

                if (options.force) {
                    grunt.log.error(errorMessage.red);
                } else {
                    grunt.fail.warn(errorMessage);
                }
            }

            grunt.log.ok();
            done();
        });
    });
};
