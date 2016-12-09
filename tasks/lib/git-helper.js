/*
 * grunt-git-subrepos
 * https://github.com/fur6y/grunt-git-subrepos
 *
 * Copyright (c) 2016 Fabian Fetting
 * Licensed under the MIT license.
 */

const CHANGED = 'CHANGED';
const LOCAL_COMMITS = 'LOCAL_COMMITS';

module.exports = (grunt) => {
    const spawnGitWithArgs = (cwd, ...args) =>
        new Promise((resolve, reject) => {
            grunt.log.debug(`Cwd: ${process.cwd()}/${cwd}`);
            grunt.log.debug('Spawn cmd: git', ...args);

            if (!grunt.option('no-write')) {
                grunt.util.spawn(
                    { cmd: 'git', opts: { cwd }, args },
                    (error, result) => {
                        grunt.log.debug('Cmd result:', error, String(result));
                        if (error) {
                            reject(error);
                        } else {
                            resolve(String(result));
                        }
                    }
                );
            }
        });

    const checkout = (path, branch) =>
        spawnGitWithArgs(path, 'checkout', '--quiet', branch);

    const fetch = path =>
        spawnGitWithArgs(path, 'fetch', '--quiet', '--prune', '--tags');

    const pull = path =>
        // command fails if HEAD is not a branch
        new Promise((resolve) => {
            spawnGitWithArgs(path, 'pull', '--quiet')
            .catch(() => resolve(''))
            .then(resolve);
        });

    const localCommits = path =>
        // command fails if HEAD is not a branch
        new Promise((resolve) => {
            spawnGitWithArgs(path, 'cherry')
            .catch(() => resolve(''))
            .then(resolve);
        });

    const diff = path =>
        spawnGitWithArgs(path, 'diff-index', 'HEAD');

    return {
        status: {
            CHANGED,
            LOCAL_COMMITS,
        },
        clone(repo) {
            return new Promise((resolve, reject) => {
                grunt.file.mkdir(repo.path);

                const args = ['clone', repo.url, '--quiet'];
                if (repo.branch) { args.push('--branch', repo.branch); }

                spawnGitWithArgs(repo.path, ...args, '.')
                .then(() => resolve(repo))
                .catch(reject);
            });
        },
        update(repo) {
            return new Promise((resolve, reject) => {
                const { path, branch } = repo;
                diff(path)
                .then((changes = '-') => {
                    const hasChanges = !!changes;
                    if (hasChanges) { return Promise.reject([CHANGED, repo]); }
                    return fetch(path);
                })
                .then(branch ? () => checkout(path, branch) : () => Promise.resolve())
                .then(() => localCommits(path, branch))
                .then((commits = '-') => {
                    const hasLocalCommits = !!commits;
                    if (hasLocalCommits) { return Promise.reject([LOCAL_COMMITS, repo]); }
                    return pull(path);
                })
                .then(() => resolve(repo))
                .catch(reject);
            });
        },
    };
};
