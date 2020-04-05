# Python Auto Venv

[![VS Code Marketplace](https://vsmarketplacebadge.apphb.com/version/whinarn.python-auto-venv.svg)](https://marketplace.visualstudio.com/items?itemName=whinarn.python-auto-venv)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/17cbbbf142bd420f83e282530c33fdc2)](https://www.codacy.com/manual/Whinarn/vscode-python-auto-venv?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Whinarn/vscode-python-auto-venv&amp;utm_campaign=Badge_Grade)
[![VS Code Marketplace](https://img.shields.io/vscode-marketplace/d/whinarn.python-auto-venv.svg)](https://marketplace.visualstudio.com/items?itemName=whinarn.python-auto-venv)
[![CircleCI](https://img.shields.io/circleci/build/gh/Whinarn/vscode-python-auto-venv?label=circle-ci)](https://circleci.com/gh/Whinarn/vscode-python-auto-venv/tree/master)
[![GitHub Release Status](https://img.shields.io/github/workflow/status/Whinarn/vscode-python-auto-venv/Release?label=release)](https://github.com/Whinarn/vscode-python-auto-venv/actions?query=workflow%3ARelease)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/Whinarn/vscode-python-auto-venv/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![Python Auto Venv](https://raw.githubusercontent.com/Whinarn/vscode-python-auto-venv/master/images/logo.png)

This extension will automatically set the Python virtual environment based on the file that you are currently editing.
This is useful for workspaces that contain more than one project with their own virtual environment.

You can find it in the VS Code marketplace [here](https://marketplace.visualstudio.com/items?itemName=whinarn.python-auto-venv).

## Features

### Virtual Environment Selection

By opening up a Python script, this extension will figure out the best suitable virtual environment to use based on where the file is located.
It effectively solves the issue of intellisense not functioning in a multi-project repository with separate virtual environments.

In order to use [pipenv](https://pipenv.pypa.io/) for detecting environments, you must first enable it in the settings for this extension.
You can also specify a specific path for pipenv if necessary.

Please note that this extension operates by changing the `python.pythonPath` property in `.vscode/settings.json` in the root workspace directory.
This means that for the best results, you should avoid having this file checked into version control since it's expected to change frequently and might cause conflicts with other people.

### Automatic Installation of Virtual Environments

If you wish for this extension to automatically install virtual environments for you based on detection of for example `Pipfile` or `requirements.txt` (this can be configured), you can enable it in the settings by the property `pythonautovenv.autoInstall`.

Once enabled, it will automatically install one of `Pipfile`, `requirements-dev.txt`, or `requirements.txt` in that specific order.
The first file that is detected will be used.
You can override these if you desire, but be aware that the names of the files will be used to pick a different installation method.
You can read more about the default installation behavior below.

If you wish to enable installation of files with other filenames, you can specify it in the `pythonautovenv.installVenvFiles` property in settings.
However, if the filename doesn't match the expectations of the default installation behavior, you must define a custom installation command (see below for more information).

### Manual Installation / Uninstallation of Virtual Environments

Virtual environments can also be installed through the command `pythonautovenv.installVenv` (`Python Auto Venv: Install Virtual Environment`) and uninstalled
through the command `pythonautovenv.uninstallVenv` (`Python Auto Venv: Uninstall Virtual Environment`).

This will work the same as the automatic installation mentioned above, with the exception that it's triggered manually instead.

### Custom Install/Uninstall Command

If you wish to use any other method of installing any of these files (or any other files that you might use) you can specify the `pythonautovenv.installVenvCommand` property in your settings. If the path to the file in particular is needed you can use `$1` as an alias inside the command. If this property is empty, the default behavior will be used, which you can read more about below.

If you need even more command over which command is being used for installing virtual enviroments based on the file detected, you can specify them in the `pythonautovenv.installVenvCommandForFile` property in your settings, which is an object with the key being the file name and the value being the command. The command works exactly like it's mentioned above.

The same information applies to uninstallation using the properties `pythonautovenv.uninstallVenvCommand` and `pythonautovenv.uninstallVenvCommandForFile`.

### Default Installation Behavior

The default installation behavior will depend on the file detected.

For any `Pipfile`, [Pipenv](https://pipenv.pypa.io/) will be used to install the dependencies using `pipenv --bare sync --dev` if a `Pipfile.lock` was found, otherwise `pipenv --bare install --dev`.

For any file starting with `requirements` and the `.txt` file extension will be installed using `pip install -r requirements.txt`.

Any other file will be ignored by the default installation behaviour.

### Default Uninstallation Behavior

The default uninstallation behavior will depend on the file detected.

For any `Pipfile`, [Pipenv](https://pipenv.pypa.io/) will be used to uninstall the virtual environment using `pipenv --rm`.

For any file starting with `requirements` and the `.txt` file extension, the virtual environment will be uninstalled by removing the directory (defined by the `pythonautovenv.venvDirectoryNames` settings property).

Any other file will be ignored by the default uninstallation behaviour.

## Requirements

You **must** have the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension installed with all of its requirements for this extension to work.

This extension also makes use of [Pipenv](https://pipenv.pypa.io/) if set to preferred or by installing Pipfile's.
