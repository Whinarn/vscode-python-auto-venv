# Contributing to Python Auto Venv

Thank you for considering contributing to this project.

## Setup

Make sure to install all of the following:

* [VS Code](https://code.visualstudio.com/Download)
* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

After you have cloned this repository install all dependencies by typing the following in your terminal:
`yarn`

## Commit Guidelines

We have strict rules over how our git commit messages can be formatted. This is due to them being used for automated semantic releases, as well as making the messages more readable and standarized.

Each commit should only ever do one change, so that it is easy to review.

### Commit Message Format

Every commit must specify at least a **type** and a **subject**. While **scope**, **body**, and **footer** remains optional.

```text
<type>(scope): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer than 100 characters (with the header being maximum 72 characters), in order for them to be easy to read in varios git tools.

**Examples:**

```text
feat(venv): automatic creation of virtual environments

Virtual environments can now be created automatically when finding a Pipfile or
a requirements.txt in your project without a matching virtual environment.
```

```text
docs(readme): added more detailed examples to the readme
```

#### Type

All supported commit types:

* **chore**: Changes that aren't relevant to a release.
* **ci**: Changes made to the CI configuration files and scripts.
* **docs**: Changes to documentation.
* **feat**: A new feature.
* **fix**: A bug fix.
* **perf**: Performance optimization.
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **style**: Changes that do not effect the logic of the code.
* **test**: Added or modified tests

#### Scope

A few recommended scopes:

* **extension**
* **pipenv**
* **settings**
* **utils**
* **venv**

Please note that you are also free to use additional scopes, but only if necessary.

#### Subject

The subject of a commit should be short and be effective in explaining it.

#### Body

A body can be used if the subject cannot accurately explain everything that the commit contains.

Have in mind however, that each commit should only contain one change.

#### Footer

A footer can be used to specify issues that can be resolved/closed.

Read more about how that works [here](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue).

## Submitting changes

Please send me a [pull request](https://github.com/Whinarn/vscode-python-auto-venv/compare) with a short and clear title and a clear description that effectively conveys what your goal of the changes are. Please also mention any issues that your pull request aims to solve.
