# Python Auto Venv

![Python Auto Venv](https://raw.githubusercontent.com/Whinarn/vscode-python-auto-venv/master/images/logo.png)

This extension will automatically set the Python virtual environment based on the file that you are currently editing.
This is useful for workspaces that contain more than one project with their own virtual environment.

You can find it in the VS Code marketplace [here](https://marketplace.visualstudio.com/items?itemName=whinarn.python-auto-venv).

## Features

By opening up a Python script, this extension will figure out the best suitable virtual environment to use based on where the file is located.
It effectively solves the issue of intellisense not functioning in a multi-project repository with separate virtual environments.

In order to use pipenv for detecting environments, you must first enable it in the settings for this extension. You can also specify a specific path for pipenv if necessary.

## Requirements

You **must** have the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension installed with all of its requirements for this extension to work.

## Extension Settings

This extension contributes the following settings:

* `pythonautovenv.enable`: enables or disables this extension (default: *true*)
* `pythonautovenv.usePipenv`: if pipenv should be used to detect virtual environments (default: *false*)
* `pythonautovenv.pipenvPath`: the path to the pipenv executable (default: *pipenv*)
* `pythonautovenv.venvDirectoryNames`: the names of possible virtual environment directories (default: *\[".venv", "venv"\]*)

## Release Notes

### 1.0.0

Initial release of Python Auto Venv